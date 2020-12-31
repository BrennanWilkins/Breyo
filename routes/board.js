const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const User = require('../models/user');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsAdmin = require('../middleware/useIsAdmin');
const useIsMember = require('../middleware/useIsMember');
const List = require('../models/list');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');
const jwt = require('jsonwebtoken');
const config = require('config');
const { getJWTPayload, getLeanJWTPayload } = require('./auth');
const { COLORS, PHOTO_IDS } = require('./utils');
const Team = require('../models/team');

const signNewToken = async (user, oldToken, getLean) => {
  // used to update user's jwt token when new board created or joined, or user promoted/demoted to/from admin
  try {
    const decoded = jwt.decode(oldToken);
    const jwtPayload = getLean ? getLeanJWTPayload(user) : getJWTPayload(user);
    // token expires at same time as oldToken
    const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });
    return token;
  } catch (err) { return new Error('Error generating token'); }
};

// returns all board & list data for a given board
router.get('/:boardID', auth, validate([param('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const boardID = req.params.boardID;
      const [board, lists, activity, activityCount] = await Promise.all([
        Board.findById(boardID).populate('members', 'email fullName avatar').lean(),
        List.find({ boardID }).sort('indexInBoard').lean(),
        Activity.find({ boardID }).sort('-date').limit(20).lean(),
        Activity.countDocuments({ boardID })
      ]);
      if (!board || !lists || !activity) { throw 'Board data not found'; }

      board.members = board.members.map(member => ({
        email: member.email,
        fullName: member.fullName,
        avatar: member.avatar,
        isAdmin: board.admins.includes(String(member._id))
      }));

      const { admins, ...boardData } = board;
      const data = { ...boardData, lists, activity };

      const isAdminInToken = req.userAdmins[boardID];
      const isAdminInBoard = admins.includes(req.userID);
      // if user's token is not up to date, send new token
      if ((!isAdminInToken && isAdminInBoard) || (isAdminInToken && !isAdminInBoard)) {
        const user = await User.findById(req.userID).populate('boards', 'title color').lean();
        user.boards = user.boards.map(board => ({
          boardID: board._id,
          title: board.title,
          color: board.color,
          isStarred: user.starredBoards.includes(String(board._id)),
          isAdmin: user.adminBoards.includes(String(board._id)),
          teamID: board.teamID
        }));
        const token = await signNewToken(user, req.header('x-auth-token'), false);
        data.invites = user.invites;
        data.boards = user.boards;
        data.token = token;
      }

      // board stores max 200 past actions, if over 250 actions then delete ones over 200
      if (activityCount > 250) {
        const allActivity = await Activity.find({ boardID }).sort('-date').skip(200).select('_id').lean();
        await Activity.deleteMany({ _id: { $in: allActivity.map(action => action._id) }});
      }

      res.status(200).json({ data });
    } catch (err) { res.sendStatus(500); }
  }
);

// create a new board w given title/background
router.post('/', auth, validate([body('title').trim().isLength({ min: 1, max: 100 }), body('color').not().isEmpty()], 'Please enter a valid title.'),
  async (req, res) => {
    try {
      let { color, title } = req.body;
      // if invalid background then default to red
      if (!COLORS.includes(color) && !PHOTO_IDS.includes(color)) { color = COLORS[0]; }
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }

      // user is admin of new board by default
      const board = new Board({ title, members: [req.userID], admins: [req.userID], color, creatorEmail: user.email, desc: '', teamID: null });
      const boardID = board._id;

      // add board to user's boards
      user.boards.unshift(boardID);
      user.adminBoards.unshift(boardID);

      const newBoard = { boardID, title, isStarred: false, isAdmin: true, color };

      // add default lists to board (to do, doing, done)
      const list1 = { boardID, title: 'To Do', cards: [], archivedCards: [], indexInBoard: 0, isArchived: false };
      const list2 = { boardID, title: 'Doing', cards: [], archivedCards: [], indexInBoard: 1, isArchived: false };
      const list3 = { boardID, title: 'Done', cards: [], archivedCards: [], indexInBoard: 2, isArchived: false };

      const actionData = { msg: null, boardMsg: 'created this board', cardID: null, listID: null, boardID };

      const results = await Promise.all([
        signNewToken(user, req.header('x-auth-token'), true),
        board.save(),
        user.save(),
        List.insertMany([list1, list2, list3]),
        addActivity(actionData, req)
      ]);

      const token = results[0];

      res.status(200).json({ board: newBoard, token });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// updates board color
router.put('/color', auth, validate([body('boardID').isMongoId(), body('color').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, color } = req.body;
      if (!COLORS.includes(color) && !PHOTO_IDS.includes(color)) { throw 'Background not found'; }

      await Board.updateOne({ _id: boardID }, { color });

      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// update board description
router.put('/desc', auth, validate([body('boardID').isMongoId(), body('desc').isLength({ max: 600 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, desc } = req.body;
      await Board.updateOne({ _id: boardID }, { desc });

      const actionData = { msg: null, boardMsg: 'updated the board description', cardID: null, listID: null, boardID };
      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// update board title
router.put('/title', auth, validate(
  [body('title').trim().isLength({ min: 1, max: 100 }),
  body('boardID').isMongoId()], 'Please enter a valid title.'), useIsMember,
  async (req, res) => {
    try {
      const { title, boardID } = req.body;
      const board = await Board.findByIdAndUpdate(boardID, { title }).select('title').lean();
      if (!board) { throw 'No board data found'; }
      const oldTitle = board.title;

      const actionData = { msg: null, boardMsg: `renamed this board from ${oldTitle} to ${title}`, cardID: null, listID: null, boardID };

      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// toggle a board as starred/unstarred in user model
router.put('/starred', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const { boardID } = req.body;
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }

      const index = user.starredBoards.indexOf(boardID);
      if (index === -1) { user.starredBoards.unshift(boardID); }
      else { user.starredBoards.splice(index, 1); }

      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// add another admin to the board
router.post('/admins', auth, validate([body('email').isEmail(), body('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { email, boardID } = req.body;
      const [board, user] = await Promise.all([await Board.findById(boardID), await User.findOne({ email })]);
      if (!board) { throw 'Board data not found'; }

      // add user to board's admins & board to user's adminBoards
      if (!board.members.includes(user._id)) { throw 'Member not found in board members'; }
      if (board.admins.includes(String(user._id))) { throw 'User already an admin'; }
      board.admins.push(user._id);
      user.adminBoards.push(boardID);

      const actionData = { msg: null, boardMsg: `changed ${user.fullName}'s permissions to admin`, cardID: null, listID: null, boardID };

      const results = await Promise.all([
        addActivity(actionData, req),
        user.save(),
        board.save()
      ]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// user receives new token on permission change to admin
router.put('/admins/promoteUser', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const isAlreadyAdmin = req.userAdmins[req.body.boardID];
      if (isAlreadyAdmin) { throw 'User already an admin'; }
      const user = await User.findById(req.userID).lean();
      const token = await signNewToken(user, req.header('x-auth-token'), true);
      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

// user receives new token on permission change from admin to member
router.put('/admins/demoteUser', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const { boardID } = req.body;
      const isAdmin = req.userAdmins[boardID];
      const isMember = req.userMembers[boardID];
      if (!isAdmin && isMember) { throw 'User already demoted'; }
      const user = await User.findById(req.userID).lean();
      const token = await signNewToken(user, req.header('x-auth-token'), true);
      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// change user permission from admin to member
router.delete('/admins/:email/:boardID', auth, validate([param('email').isEmail(), param('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { email, boardID } = req.params;
      const [board, user] = await Promise.all([Board.findById(boardID), User.findOne({ email })]);
      if (!board || !user) { throw 'No board or user data found'; }

      // remove user from board's admins
      const adminIndex = board.admins.indexOf(String(user._id));
      if (adminIndex === -1) { throw 'User not found in boards admins'; }
      if (board.admins.length <= 1) { throw 'There must be at least 1 admin at all times'; }
      board.admins.splice(adminIndex, 1);
      // remove board from user's adminBoards
      const boardIndex = user.adminBoards.indexOf(boardID);
      if (boardIndex === -1) { throw 'Board not found in users boards'; }
      user.adminBoards.splice(boardIndex, 1);

      const actionData = { msg: null, boardMsg: `changed ${user.fullName}'s permissions to member`, cardID: null, listID: null, boardID };

      const results = await Promise.all([addActivity(actionData, req), user.save(), board.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// send invite to a user to join the board
router.post('/invites', auth, validate([body('email').isEmail(), body('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, email } = req.body;
      const [board, invitee] = await Promise.all([Board.findById(boardID).select('title').lean(), User.findOne({ email })]);
      if (!board) { throw 'No board data found'; }
      if (!invitee) { return res.status(400).json({ msg: 'No user was found for that email.' }); }

      // user already invited
      if (invitee.invites.find(invite => String(invite.boardID) === boardID)) {
        return res.status(400).json({ msg: 'You have already invited this person to this board.' });
      }
      // user already member
      if (invitee.boards.includes(boardID)) {
        return res.status(400).json({ msg: 'This user is already a member of this board.' });
      }

      invitee.invites = [...invitee.invites, { inviterEmail: req.email, inviterName: req.fullName, title: board.title, boardID }];
      await invitee.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// accept invitation to join a board
router.put('/invites/accept', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const boardID = req.body.boardID;
      const [board, user] = await Promise.all([Board.findById(boardID), User.findById(req.userID)]);
      if (!user) { throw 'No user data found'; }

      // remove invite from user's invites
      user.invites = user.invites.filter(invite => String(invite.boardID) !== boardID);

      if (!board) {
        // board no longer exists, remove invite & return
        await user.save();
        return res.sendStatus(400);
      }

      // add board to user model & user to board's members
      user.boards.push(boardID);
      board.members.push(user._id);

      const actionData = { msg: null, boardMsg: 'was added to this board', cardID: null, listID: null, boardID: board._id, email: user.email, fullName: user.fullName };

      const results = await Promise.all([
        user.save(),
        board.save(),
        addActivity(actionData, req),
        signNewToken(user, req.header('x-auth-token'), true)
      ]);
      const newActivity = results[2];
      const token = results[3];

      const updatedUser = await User.findById(req.userID).populate('boards', 'title color').lean();
      updatedUser.boards = updatedUser.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(boardID),
        isAdmin: user.adminBoards.includes(boardID),
        teamID: board.teamID
      }));

      res.status(200).json({ token, newActivity, boards: updatedUser.boards, invites: updatedUser.invites });
    } catch(err) { res.sendStatus(500); }
  }
);

// reject invitation to join a board
router.put('/invites/reject', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }
      // remove invite from user's model
      user.invites = user.invites.filter(invite => String(invite.boardID) !== req.body.boardID);
      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// remove a user from the board
router.put('/members/remove', auth, validate([body('email').isEmail(), body('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { email, boardID } = req.body;
      const user = await User.findOne({ email }).select('fullName boards').lean();
      if (!user) { throw 'No user found for given email'; }
      if (!user.boards.find(id => String(id) === boardID)) { throw 'User not a member of the board'; }
      if (req.email === email) { throw 'Cannot remove yourself'; }

      const actionData = { msg: null, boardMsg: `removed ${user.fullName} from this board`, cardID: null, listID: null, boardID };

      const results = await Promise.all([
        addActivity(actionData, req),
        Board.updateOne({ _id: boardID }, { $pull: { boards: user._id, admins: user._id } }),
        User.updateOne({ email }, { $pull: { boards: boardID, adminBoards: boardID, starredBoards: boardID } })
      ]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// delete a board, its lists, and all of its activity
router.delete('/:boardID', auth, validate([param('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const boardID = req.params.boardID;
      const board = await Board.findByIdAndDelete(boardID).select('members');
      if (!board) { throw 'No board data found'; }

      if (board.teamID) { await Team.updateOne({ _id: board.teamID }, { $pull: { boards: board._id } }); }

      await Promise.all([
        User.updateMany({ _id: { $in: board.members }}, { $pull: { boards: board._id, adminBoards: boardID, starredBoards: boardID } }),
        List.deleteMany({ boardID }),
        Activity.deleteMany({ boardID })
      ]);

      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// leave a board
router.put('/leave', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const boardID = req.body.boardID;
      const board = await Board.findById(boardID);
      if (!board) { throw 'No board data found'; }

      // check if user is able to leave board
      if (board.admins.includes(req.userID) && board.admins.length < 2) {
        throw 'There must be at least one other admin for user to leave board';
      }

      board.members = board.members.filter(id => String(id) !== req.userID);
      board.admins = board.admins.filter(id => id !== req.userID);

      // remove user from cards they are a member of
      const lists = await List.find({ boardID });
      for (let list of lists) {
        let shouldUpdate = false;
        for (let card of list.cards) {
          for (let i = card.members.length - 1; i >= 0; i--) {
            if (card.members[i].email === req.email) { card.members.splice(i, 1); }
            shouldUpdate = true;
          }
        }
        // only need to update list if member changed
        if (shouldUpdate) { await list.save(); }
      }

      const actionData = { msg: null, boardMsg: 'left this board', cardID: null, listID: null, boardID };

      const results = await Promise.all([
        addActivity(actionData, req),
        User.updateOne({ _id: req.userID }, { $pull: { boards: board._id, starredBoards: boardID, adminBoards: boardID }}),
        board.save()
      ]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.signNewToken = signNewToken;
