const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsAdmin = require('../middleware/useIsAdmin');
const useSSE = require('../middleware/useSSE');

router.get('/:boardID', auth, validate([param('boardID').not().isEmpty().escape()]), useSSE,
  (req, res) => {
    const boardQuery = Board.findById(req.params.boardID);
    // stream board data to client every 10 seconds
    const dataInterval = setInterval(() => {
      boardQuery.exec((err, board) => {
        res.sendEventData(board);
      });
    }, 10000);

    res.on('close', () => {
      clearInterval(dataInterval);
      res.end();
    });
  }
);

router.post('/', auth, validate(
  [body('title').trim().isLength({ min: 1, max: 50 }).escape()]
  , 'Please enter a valid title.'),
  async (req, res) => {
    try {
      // user is admin of new board by default
      const board = new Board({ title: req.body.title, members: [{ userID: req.userID, isAdmin: true }] });
      await board.save();
      // add board to user's boards
      const user = await User.findById(req.userID);
      user.boards.unshift({ boardID: board._id, title: board.title, isStarred: false, isAdmin: true });
      await user.save();
      res.status(200).json({ boardID: board._id });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
router.put('/title', auth, validate(
  [body('title').trim().isLength({ min: 1, max: 50 }).escape(),
  body('boardID').not().isEmpty().escape()], 'Please enter a valid title.'),
  async (req, res) => {
    try {
      const board = await Board.findOne({ _id: req.body.boardID });
      board.title = req.body.title;
      await board.save();
      for (let member of board.members) {
        const user = await User.findById(member.userID);
        const matchingBoard = user.boards.find(board => board.boardID === req.body.boardID);
        if (!matchingBoard) { throw 'err'; }
        matchingBoard.title = req.body.title;
        await user.save();
      }
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.put('/starred', auth, validate([body('boardID').not().isEmpty()]),
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      const matchingBoard = user.boards.find(board => board.boardID === req.body.boardID);
      matchingBoard.isStarred = !matchingBoard.isStarred;
      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/admins/add', auth, validate(
  [body('email').not().isEmpty().trim().escape(),
  body('boardID').not().isEmpty().trim().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findOne({ email: req.body.email });
      if (!board || !user) { throw 'err'; }
      const members = board.members;
      // find user in board's members and change user to admin if found
      const matchingMember = members.findIndex(member => member.userID === user._id && !member.isAdmin);
      if (members.length > 1 && matchingMember) {
        members[i].isAdmin = true;
        user.boards = user.boards.map(board => {
          if (board.boardID === req.body.boardID) { return { ...board, isAdmin: true }; }
          return board;
        });
        await user.save();
        await board.save();
        res.sendStatus(200);
      } else { throw 'err'; }
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/admins/remove', auth, validate(
  [body('email').not().isEmpty().trim().escape(),
  body('boardID').not().isEmpty().trim().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findOne({ email: req.body.email });
      if (!board || !user) { throw 'err'; }
      const members = board.members;
      // find user in board's members and change user isAdmin to false if found
      const matchingMember = members.findIndex(member => member.userID === user._id && !member.isAdmin);
      if (members.length > 1 && matchingMember) {
        members[i].isAdmin = false;
        user.boards = user.boards.map(board => {
          if (board.boardID === req.body.boardID) { return { ...board, isAdmin: false }; }
          return board;
        });
        await user.save();
        await board.save();
        res.sendStatus(200);
      } else { throw 'err'; }
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/invites/send', auth, validate(
  [body('email').not().isEmpty().trim().escape(),
  body('boardID').not().isEmpty().trim().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const inviter = await User.findById(req.userID);
      if (!board || !inviter) { throw 'err'; }
      // find user based on user's email
      const invitee = await User.findOne({ email: req.body.email });
      // no user found
      if (!invitee) { return res.status(400).json({ msg: 'No user was found for that email' }); }
      invitee.invites = [...invitee.invites, { inviterEmail: inviter.email, inviterName: inviter.fullName, title: board.title, boardID: board._id }];
      invitee.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.put('/invites/accept', auth, validate(
  [body('boardID').not().isEmpty().trim().escape()]),
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findById(req.userID);
      if (!board || !user) { throw 'err'; }
      user.invites = user.invites.filter(invite => invite.boardID !== req.body.boardID);
      user.boards = [...user.boards, { boardID: board._id, title: board.title, isStarred: false, isAdmin: false }];
      board.members = [...board.members, { userID: req.userID, isAdmin: false }];
      await user.save();
      await board.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.put('/invites/reject', auth, validate(
  [body('boardID').not().isEmpty().trim().escape()]),
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findById(req.userID);
      if (!board || !user) { throw 'err'; }
      user.invites = user.invites.filter(invite => invite.boardID !== req.body.boardID);
      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/members/remove', auth, validate(
  [body('email').not().isEmpty().trim().escape(),
  body('boardID').not().isEmpty().trim().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      const user = await User.findOne({ email: req.body.email });
      if (!board || !user) { throw 'err'; }
      // remove user from board's members and remove board from user's boards
      board.members = board.members.filter(member => member.userID !== user._id);
      user.boards = user.boards.filter(board => board.boardID !== board._id);
      await board.save();
      await user.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.delete('/:boardID', auth, validate([param('boardID').not().isEmpty().trim().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const board = await Board.findById(req.params.boardID);
      for (let member of board.members) {
        const user = await User.findById(member.userID);
        user.boards = user.boards.filter(board => board.boardID !== board._id);
        await user.save();
      }
      await Board.findByIdAndDelete(req.params.boardID);
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

module.exports = router;
