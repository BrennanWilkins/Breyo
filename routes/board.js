const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/', auth, validate(
  [body('title').trim().isLength({ min: 1, max: 50 }).escape()]
  , 'Please enter a valid title.'),
  async (req, res) => {
    try {
      // user is admin of new board by default
      const board = new Board({ title: req.body.title, members: [{ userID: req.userID, isAdmin: true }] });
      await board.save();
      // add board to user's boards
      const user = await User.findOne({ _id: req.userID });
      user.boards.unshift({ boardID: board._id, title: board.title, isStarred: false, isAdmin: true });
      await user.save();
      res.status(200).json({ boardID: board._id });
    } catch(err) { return res.status(500); }
  }
);

module.exports = router;
