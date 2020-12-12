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

const COLORS = ['#f05544', '#f09000', '#489a3c', '#0079bf', '#7150df',
  '#38bbf4', '#ad5093', '#4a32dd', '#046b8b'];

const PHOTO_IDS = ['1607556049122-5e3874a25a1f', '1605325811474-ba58cf3180d8', '1513580638-fda5563960d6',
'1554129352-f8c3ab6d5595', '1596709097416-6d4206796022', '1587732282555-321fddb19dc0',
'1605580556856-db8fae94b658', '1605738862138-6704bedb5202', '1605447781678-2a5baca0e07b'];

// returns all board & list data for a given board
router.get('/:boardID', auth, validate([param('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardID).lean();
      if (!board) { throw 'Board data not found'; }
      const listData = await List.find({ boardID: board._id }).lean();
      if (!listData) { throw 'List data not found'; }
      const activity = await Activity.find({ boardID: board._id }).sort('-date').limit(20).lean();
      if (!activity) { throw 'Activity data not found'; }
      const data = { ...board, lists: listData, activity };

      const decoded = jwt.decode(req.header('x-auth-token'));
      const isAdminInToken = req.userAdmins[req.params.boardID];
      const isAdminInBoard = board.members.find(member => member.email === decoded.user.email).isAdmin;
      // user's token is not up to date, send new token
      if (isAdminInBoard !== isAdminInToken) {
        const user = await User.findById(req.userID);
        const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });
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
      // if invalid background then default to red
      const color = COLORS.includes(req.body.color) || PHOTO_IDS.includes(req.body.color) ? req.body.color : COLORS[0];
      const user = await User.findById(req.userID);
      if (!user) { throw 'No user data found'; }
      const title = req.body.title;
      // user is admin of new board by default
      const board = new Board({ title, members: [{ email: user.email, fullName: user.fullName, isAdmin: true }],
        color, creatorEmail: user.email, desc: '' });
      await board.save();

      // add board to user's boards
      const newBoard = { boardID: board._id, title, isStarred: false, isAdmin: true, color: board.color };
      user.boards.unshift(newBoard);
      await user.save();

      // add default lists to board (to do, doing, done)
      const list1 = new List({ boardID: board._id, title: 'To Do', cards: [], archivedCards: [], indexInBoard: 0, isArchived: false });
      const list2 = new List({ boardID: board._id, title: 'Doing', cards: [], archivedCards: [], indexInBoard: 1, isArchived: false });
      const list3 = new List({ boardID: board._id, title: 'Done', cards: [], archivedCards: [], indexInBoard: 2, isArchived: false });
      await list1.save(); await list2.save(); await list3.save();

      const actionData = { msg: null, boardMsg: 'created this board', cardID: null, listID: null, boardID: board._id };
      await addActivity(actionData, req);

      const decoded = jwt.decode(req.header('x-auth-token'));
      // update client's token to show new board, new token expires at same time
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });

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
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'No board data found'; }
      board.color = color;

      // for each member of board, update the board color in their model
      const emails = board.members.map(member => member.email);
      const users = await User.find({ email: { $in: emails }});
      for (let user of users) {
        const index = user.boards.findIndex(board => String(board.boardID) === String(req.body.boardID));
        if (index < 0) { throw 'Board not found in users model'; }
        user.boards[index].color = color;
        user.markModified('boards');
        await user.save();
      }

      await board.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// update board description
router.put('/desc', auth, validate([body('boardID').isMongoId(), body('desc').isLength({ max: 600 })]), useIsMember,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'No board data found'; }
      board.desc = req.body.desc;
      await board.save();

      const actionData = { msg: null, boardMsg: 'updated the board description', cardID: null, listID: null, boardID: board._id };
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
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'No board data found'; }
      const title = req.body.title;
      const oldTitle = board.title;
      board.title = title;

      // for each member of board, update board title in their user model
      const emails = board.members.map(member => member.email);
      const users = await User.find({ email: { $in: emails }});
      for (let user of users) {
        const index = user.boards.findIndex(board => String(board.boardID) === String(req.body.boardID));
        if (index < 0) { throw 'Board not found in users model'; }
        user.boards[index].title = title;
        user.markModified('boards');
        await user.save();
      }

      await board.save();

      const actionData = { msg: null, boardMsg: `renamed this board from ${oldTitle} to ${title}`, cardID: null, listID: null, boardID: board._id };
      const newActivity = await addActivity(actionData, req);

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
      const board = await Board.findById(req.body.boardID);
      const user = await User.findOne({ email: req.body.email });
      if (!board || !user) { throw 'Board or user data not found'; }
      // find user in board's members and change user to admin if found
      const memberIndex = board.members.findIndex(member => member.email === user.email && !member.isAdmin);
      if (memberIndex === -1) { throw 'Member not found in board members'; }
      if (board.members.length <= 1) { throw 'Not enough board members to add new admin'; }
      board.members[memberIndex].isAdmin = true;
      // update board in user's board model to isAdmin
      const boardIndex = user.boards.findIndex(board => String(board.boardID) === String(req.body.boardID));
      if (boardIndex === -1) { throw 'Board not found in users boards'; }
      user.boards[boardIndex].isAdmin = true;
      user.markModified('boards');
      board.markModified('members');
      await user.save();
      await board.save();

      const actionData = { msg: null, boardMsg: `changed ${user.fullName}'s permissions to admin`, cardID: null, listID: null, boardID: board._id };
      const newActivity = await addActivity(actionData, req);

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
      const user = await User.findById(req.userID);
      const decoded = jwt.decode(req.header('x-auth-token'));
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });
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
      const user = await User.findById(req.userID);
      const decoded = jwt.decode(req.header('x-auth-token'));
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });
      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// change user permission from admin to member
router.delete('/admins/:email/:boardID', auth, validate([param('email').isEmail(), param('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardID);
      const user = await User.findOne({ email: req.params.email });
      if (!board || !user) { throw 'No board or user data found'; }
      // find user in board's members and change user isAdmin to false if found
      const memberIndex = board.members.findIndex(member => member.email === user.email && member.isAdmin);
      if (memberIndex === -1) { throw 'User not found in boards members'; }
      const adminCount = board.members.filter(member => member.isAdmin).length;
      if (adminCount <= 1) { throw 'There must be at least 1 admin at all times'; }
      board.members[memberIndex].isAdmin = false;
      const boardIndex = user.boards.findIndex(board => String(board.boardID) === String(req.params.boardID));
      if (boardIndex === -1) { throw 'Board not found in users boards'; }
      user.boards[boardIndex].isAdmin = false;
      user.markModified('boards');
      board.markModified('members');
      await user.save();
      await board.save();

      const actionData = { msg: null, boardMsg: `changed ${user.fullName}'s permissions to member`, cardID: null, listID: null, boardID: board._id };
      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// send invite to a user to join the board
router.post('/invites', auth, validate([body('email').isEmail(), body('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const inviter = await User.findById(req.userID);
      if (!board || !inviter) { throw 'No board or user data found'; }
      // find user based on user's email
      const invitee = await User.findOne({ email: req.body.email });
      if (!invitee) { return res.status(400).json({ msg: 'No user was found for that email.' }); }
      // user already invited
      if (invitee.invites.find(invite => String(invite.boardID) === String(board._id))) {
        return res.status(400).json({ msg: 'You have already invited this person to this board.' });
      }
      if (invitee.boards.find(userBoard => String(userBoard.boardID) === String(board._id))) {
        return res.status(400).json({ msg: 'This user is already a member of this board.' });
      }
      invitee.invites = [...invitee.invites, { inviterEmail: inviter.email, inviterName: inviter.fullName, title: board.title, boardID: board._id }];
      invitee.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// accept invitation to join a board
router.put('/invites/accept', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findById(req.userID);
      if (!board || !user) { throw 'No board or user data found'; }
      // remove invite from user's invites
      user.invites = user.invites.filter(invite => String(invite.boardID) !== req.body.boardID);
      // add board to user model
      user.boards = [...user.boards, { boardID: board._id, title: board.title, isStarred: false, isAdmin: false, color: board.color }];
      // add user to board members
      board.members = [...board.members, { email: user.email, fullName: user.fullName, isAdmin: false }];
      await user.save();
      await board.save();

      const actionData = { msg: null, boardMsg: 'was added to this board', cardID: null, listID: null, boardID: board._id, email: user.email, fullName: user.fullName };
      const newActivity = await addActivity(actionData, req);

      const decoded = jwt.decode(req.header('x-auth-token'));
      // update client's token to show new board, new token expires at same time
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });

      res.status(200).json({ token, newActivity, boards: user.boards, invites: user.invites });
    } catch(err) { res.sendStatus(500); }
  }
);

// reject invitation to join a board
router.put('/invites/reject', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findById(req.userID);
      if (!board || !user) { throw 'No board or user data found'; }
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
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'No board data found'; }
      const user = await User.findOne({ email: req.body.email });
      if (!user) { throw 'No user found for given email'; }
      // remove user from board's members and remove board from user's boards
      board.members = board.members.filter(member => member.email !== user.email);
      user.boards = user.boards.filter(board => board.boardID !== board._id);
      await board.save();
      await user.save();

      const actionData = { msg: null, boardMsg: `removed ${user.fullName} from this board`, cardID: null, listID: null, boardID: board._id };
      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// delete a board, its lists, and all of its activity
router.delete('/:boardID', auth, validate([param('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardID);
      if (!board) { throw 'No board data found'; }
      // for each member of board remove board from its model
      for (let member of board.members) {
        const user = await User.findOne({ email: member.email });
        if (!user) { throw 'User model for board member not found'; }
        user.boards = user.boards.filter(board => String(board.boardID) !== String(req.params.boardID));
        await user.save();
      }
      await Board.findByIdAndDelete(req.params.boardID);
      await List.deleteMany({ boardID: req.params.boardID });
      await Activity.deleteMany({ boardID: req.params.boardID });
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// leave a board
router.put('/leave', auth, validate([body('boardID').isMongoId()]),
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findById(req.userID);
      if (!board || !user) { throw 'No board or user data found'; }
      const member = board.members.find(member => member.email === user.email);
      if (!member) { throw 'User not found in boards members'; }
      // check if user is able to leave board
      if (member.isAdmin) {
        const adminCount = board.members.filter(member => member.isAdmin).length;
        if (adminCount < 2) { throw 'There must be at least one other admin for user to leave board'; }
      }
      user.boards = user.boards.filter(board => String(board.boardID) !== String(req.body.boardID));
      board.members = board.members.filter(member => member.email !== user.email);
      // remove user from cards they are a member of
      const lists = await List.find({ boardID: board._id });
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

      const actionData = { msg: null, boardMsg: 'left this board', cardID: null, listID: null, boardID: board._id };
      const newActivity = await addActivity(actionData, req);

      await user.save();
      await board.save();
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
