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
const { getJWTPayload } = require('./auth');

const COLORS = ['#f05544', '#f09000', '#489a3c', '#0079bf', '#7150df',
  '#38bbf4', '#ad5093', '#4a32dd', '#046b8b'];

const PHOTO_IDS = ['1607556049122-5e3874a25a1f', '1605325811474-ba58cf3180d8', '1513580638-fda5563960d6',
'1554129352-f8c3ab6d5595', '1596709097416-6d4206796022', '1587732282555-321fddb19dc0',
'1605580556856-db8fae94b658', '1605738862138-6704bedb5202', '1605447781678-2a5baca0e07b'];

const signNewToken = async (user, oldToken) => {
  // used to update user's jwt token when new board created or joined, or user promoted/demoted to/from admin
  try {
    const decoded = jwt.decode(oldToken);
    const jwtPayload = getJWTPayload(user);
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
      const [board, lists, activity] = await Promise.all([
        Board.findById(boardID).lean(),
        List.find({ boardID }).lean(),
        Activity.find({ boardID }).sort('-date').limit(20).lean()
      ]);
      if (!board || !lists || !activity) { throw 'Board data not found'; }
      const data = { ...board, lists, activity };

      const isAdminInToken = req.userAdmins[boardID];
      const isAdminInBoard = board.members.find(member => member.email === req.email).isAdmin;
      // if user's token is not up to date, send new token
      if (isAdminInBoard !== isAdminInToken) {
        const user = await User.findById(req.userID).lean();
        const token = await signNewToken(user, req.header('x-auth-token'));
        data.invites = user.invites;
        data.boards = user.boards;
        data.token = token;
      }

      res.status(200).json({ data });
    } catch (err) { res.sendStatus(500); }
  }
);

// create a new board w given title/background
router.post('/', auth, validate([body('title').trim().isLength({ min: 1, max: 100 })], 'Please enter a valid title.'),
  async (req, res) => {
    try {
      let color = req.body.color;
      // if invalid background then default to red
      if (!COLORS.includes(req.body.color) && !PHOTO_IDS.includes(req.body.color)) { color = COLORS[0]; }
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }
      const title = req.body.title;

      // user is admin of new board by default
      const board = new Board({ title, members: [{ email: user.email, fullName: user.fullName, isAdmin: true }],
        color, creatorEmail: user.email, desc: '' });
      const boardID = board._id;

      // add board to user's boards
      const newBoard = { boardID, title, isStarred: false, isAdmin: true, color };
      user.boards.unshift(newBoard);

      // add default lists to board (to do, doing, done)
      const list1 = { boardID, title: 'To Do', cards: [], archivedCards: [], indexInBoard: 0, isArchived: false };
      const list2 = { boardID, title: 'Doing', cards: [], archivedCards: [], indexInBoard: 1, isArchived: false };
      const list3 = { boardID, title: 'Done', cards: [], archivedCards: [], indexInBoard: 2, isArchived: false };

      const actionData = { msg: null, boardMsg: 'created this board', cardID: null, listID: null, boardID };

      const results = await Promise.all([
        signNewToken(user, req.header('x-auth-token')),
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
router.put('/color', auth, validate([body('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const color = req.body.color;
      if (!COLORS.includes(color) && !PHOTO_IDS.includes(color)) { throw 'Background not found'; }

      const board = await Board.findByIdAndUpdate(req.body.boardID, { color }).select('members').lean();
      if (!board) { throw 'No board data found'; }

      // for each member of board, update the board color in their model
      const emails = board.members.map(member => member.email);
      const users = await User.find({ email: { $in: emails }});
      for (let user of users) {
        const index = user.boards.findIndex(board => String(board.boardID) === String(req.body.boardID));
        if (index < 0) { throw 'Board not found in users model'; }
        user.boards[index].color = color;
        user.markModified('boards');
      }
      await Promise.all(users.map(user => user.save()));

      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// update board description
router.put('/desc', auth, validate([body('boardID').isMongoId(), body('desc').isLength({ max: 600 })]), useIsMember,
  async (req, res) => {
    try {
      const boardID = req.body.boardID;
      const board = await Board.findByIdAndUpdate(boardID, { desc: req.body.desc }).lean();
      if (!board) { throw 'No board data found'; }

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
      const board = await Board.findByIdAndUpdate(boardID, { title }).select('members title').lean();
      if (!board) { throw 'No board data found'; }
      const oldTitle = board.title;

      // for each member of board, update board title in their user model
      const emails = board.members.map(member => member.email);
      const users = await User.find({ email: { $in: emails }});
      for (let user of users) {
        const index = user.boards.findIndex(board => String(board.boardID) === boardID);
        if (index < 0) { throw 'Board not found in users model'; }
        user.boards[index].title = title;
        user.markModified('boards');
      }

      const actionData = { msg: null, boardMsg: `renamed this board from ${oldTitle} to ${title}`, cardID: null, listID: null, boardID };

      const results = await Promise.all([addActivity(actionData, req), ...users.map(user => user.save())]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// toggle a board as starred/unstarred in user model
router.put('/starred', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }
      const index = user.boards.findIndex(board => String(board.boardID) === String(req.body.boardID));
      if (index === -1) { throw 'Board not found in users board model'; }
      user.boards[index].isStarred = !user.boards[index].isStarred;
      user.markModified('boards');
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
      const [board, user] = await Promise.all([Board.findById(boardID), User.findOne({ email })]);
      if (!board || !user) { throw 'Board or user data not found'; }

      // find user in board's members and change user to admin if found
      const memberIndex = board.members.findIndex(member => member.email === email && !member.isAdmin);
      if (memberIndex === -1) { throw 'Member not found in board members'; }
      if (board.members.length <= 1) { throw 'Not enough board members to add new admin'; }
      board.members[memberIndex].isAdmin = true;

      // update board in user's board model to isAdmin
      const boardIndex = user.boards.findIndex(board => String(board.boardID) === boardID);
      if (boardIndex === -1) { throw 'Board not found in users boards'; }
      user.boards[boardIndex].isAdmin = true;
      user.markModified('boards');
      board.markModified('members');

      const actionData = { msg: null, boardMsg: `changed ${user.fullName}'s permissions to admin`, cardID: null, listID: null, boardID };

      const results = await Promise.all([addActivity(actionData, req), user.save(), board.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// user receives new token on permission change to admin
router.put('/admins/promoteUser', auth,
  async (req, res) => {
    try {
      const isAlreadyAdmin = req.userAdmins[req.body.boardID];
      if (isAlreadyAdmin) { throw 'User already an admin'; }
      const user = await User.findById(req.userID).lean();
      const token = await signNewToken(user, req.header('x-auth-token'));
      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

// user receives new token on permission change from admin to member
router.put('/admins/demoteUser', auth,
  async (req, res) => {
    try {
      const isAdmin = req.userAdmins[req.body.boardID];
      const isMember = req.userMembers[req.body.boardID];
      if (!isAdmin && isMember) { throw 'User already demoted'; }
      const user = await User.findById(req.userID).lean();
      const token = await signNewToken(user, req.header('x-auth-token'));
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

      // find user in board's members and change user isAdmin to false if found
      const memberIndex = board.members.findIndex(member => member.email === email && member.isAdmin);
      if (memberIndex === -1) { throw 'User not found in boards members'; }
      const adminCount = board.members.filter(member => member.isAdmin).length;
      if (adminCount <= 1) { throw 'There must be at least 1 admin at all times'; }
      board.members[memberIndex].isAdmin = false;
      const boardIndex = user.boards.findIndex(board => String(board.boardID) === boardID);
      if (boardIndex === -1) { throw 'Board not found in users boards'; }
      user.boards[boardIndex].isAdmin = false;
      user.markModified('boards');
      board.markModified('members');

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
      if (invitee.boards.find(userBoard => String(userBoard.boardID) === boardID)) {
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

      // add board to user model
      user.boards = [...user.boards, { boardID: board._id, title: board.title, isStarred: false, isAdmin: false, color: board.color }];
      // add user to board members
      board.members = [...board.members, { email: user.email, fullName: user.fullName, isAdmin: false }];

      const actionData = { msg: null, boardMsg: 'was added to this board', cardID: null, listID: null, boardID: board._id, email: user.email, fullName: user.fullName };

      const results = await Promise.all([
        user.save(),
        board.save(),
        addActivity(actionData, req),
        signNewToken(user, req.header('x-auth-token'))
      ]);
      const newActivity = results[2];
      const token = results[3];

      res.status(200).json({ token, newActivity, boards: user.boards, invites: user.invites });
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
      const [board, user] = await Promise.all([Board.findById(boardID), User.findOne({ email })]);
      if (!board) { throw 'No board data found'; }
      if (!user) { throw 'No user found for given email'; }

      // remove user from board's members and remove board from user's boards
      board.members = board.members.filter(member => member.email !== email);
      user.boards = user.boards.filter(board => String(board.boardID) !== boardID);

      const actionData = { msg: null, boardMsg: `removed ${user.fullName} from this board`, cardID: null, listID: null, boardID };

      const results = await Promise.all([addActivity(actionData, req), board.save(), user.save()]);
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
      const board = await Board.findByIdAndDelete(boardID).select('members').lean();
      if (!board) { throw 'No board data found'; }

      // for each member of board remove board from its model
      const emails = board.members.map(member => member.email);
      const members = await User.find({ email: { $in: emails }});
      for (let member of members) {
        member.boards = member.boards.filter(board => String(board.boardID) !== boardID);
      }

      await Promise.all([
        ...members.map(member => member.save()),
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
      const [board, user] = await Promise.all([Board.findById(boardID), User.findById(req.userID)]);
      if (!board || !user) { throw 'No board or user data found'; }

      const member = board.members.find(member => member.email === user.email);
      if (!member) { throw 'User not found in boards members'; }
      // check if user is able to leave board
      if (member.isAdmin) {
        const adminCount = board.members.filter(member => member.isAdmin).length;
        if (adminCount < 2) { throw 'There must be at least one other admin for user to leave board'; }
      }

      user.boards = user.boards.filter(board => String(board.boardID) !== boardID);
      board.members = board.members.filter(member => member.email !== user.email);

      // remove user from cards they are a member of
      const lists = await List.find({ boardID });
      for (let list of lists) {
        let shouldUpdate = false;
        for (let card of list.cards) {
          for (let i = card.members.length - 1; i >= 0; i--) {
            if (card.members[i].email === user.email) { card.members.splice(i, 1); }
            shouldUpdate = true;
          }
        }
        // only need to update list if member changed
        if (shouldUpdate) { await list.save(); }
      }

      const actionData = { msg: null, boardMsg: 'left this board', cardID: null, listID: null, boardID };

      const results = await Promise.all([addActivity(actionData, req), user.save(), board.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
