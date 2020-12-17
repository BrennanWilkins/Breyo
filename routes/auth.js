const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const List = require('../models/list');
const Board = require('../models/board');

const getJWTPayload = user => {
  // create jwt sign payload for easier user data lookup
  const userMembers = {};
  const userAdmins = {};
  for (let board of user.boards) {
    userMembers[board.boardID] = true;
    if (board.isAdmin) { userAdmins[board.boardID] = true; }
  }
  return { email: user.email, userID: user._id, fullName: user.fullName, userMembers, userAdmins };
};

const getLeanJWTPayload = user => {
  // create jwt sign payload for user data that hasnt been populated yet
  const userMembers = {};
  const userAdmins = {};
  for (let boardID of user.boards) { userMembers[boardID] = true; }
  for (let boardID of user.adminBoards) { userAdmins[boardID] = true; }
  return { email: user.email, userID: user._id, fullName: user.fullName, userMembers, userAdmins };
};

// returns a user's boards & invites to be used on dashboard page
router.get('/userData', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color').lean();
      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id))
      }));

      if (!user) { throw 'user data not found'; }
      res.status(200).json({ boards: user.boards, invites: user.invites });
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/login', validate(
  [body('email').not().isEmpty().isEmail(),
  body('password').not().isEmpty().trim().escape()],
  'Email and password cannot be empty.'),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).populate('boards', 'title color').lean();
      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id))
      }));

      // return 400 error if no user found
      if (!user) { return res.status(400).json({ msg: 'Incorrect username or password.' }); }

      // verify if correct password
      const same = await bcryptjs.compare(password, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect email or password.' }); }

      // create jwt token that expires in 7 days
      const jwtPayload = getJWTPayload(user);
      const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: '7d' });

      res.status(200).json({ token, fullName: user.fullName, email, invites: user.invites, boards: user.boards });
    } catch(err) { return res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

router.post('/signup', validate(
  [body('email').isEmail(),
  body('fullName').isLength({ min: 1, max: 100 }),
  body('password').isLength({ min: 8, max: 100 }),
  body('confirmPassword').isLength({ min: 8, max: 100 })],
  'There was an error in one of the fields.'),
  async (req, res) => {
    try {
      const { fullName, password, confirmPassword, email } = req.body;
      // user full name must be characters a-z or A-Z
      if (!fullName.match(/^[ a-zA-Z]+$/)) {
        return res.status(400).json({ msg: 'Please enter a valid full name.' });
      }
      if (password !== confirmPassword) {
        return res.status(400).json({ msg: 'Password must be equal to confirm password.' });
      }

      // check if email exists in user collection already
      const emailExists = await User.exists({ email });
      if (emailExists) { return res.status(400).json({ msg: 'That email is already taken.' }); }

      const hashedPassword = await bcryptjs.hash(password, 10);

      const user = new User({ email, password: hashedPassword, fullName, invites: [], boards: [], adminBoards: [], starredBoards: [] });

      await user.save();

      // signup was successful, login
      // create jwt token that expires in 7 days
      const jwtPayload = getJWTPayload(user);
      const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: '7d' });

      res.status(200).json({ token, email, fullName, invites: [], boards: [] });
    } catch(err) { res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

// retrieve user data if userID token already present
router.post('/autoLogin', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color').lean();
      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id))
      }));

      if (!user) { throw 'User data not found'; }
      res.status(200).json({ email: user.email, fullName: user.fullName, invites: user.invites, boards: user.boards });
    } catch(err) { res.sendStatus(500); }
  }
);

router.post('/changePass', auth, validate(
  [body('newPassword').isLength({ min: 8, max: 100 }),
  body('confirmPassword').isLength({ min: 8, max: 100 }),
  body('oldPassword').not().isEmpty()
  ], 'There is an error in one of the fields.'),
  async (req, res) => {
    try {
      const { newPassword, confirmPassword, oldPassword } = req.body;
      if (newPassword !== confirmPassword) {
        return res.status(400).json({ msg: 'Confirm password must be equal to your new password.' });
      }
      const user = await User.findById(req.userID);

      // confirm that user entered old password correct
      const same = await bcryptjs.compare(oldPassword, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect password.' }); }

      const hashedPass = await bcryptjs.hash(newPassword, 10);
      user.password = hashedPass;

      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.delete('/deleteAccount', auth,
  async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.userID).lean();

      for (let boardID of user.boards) {
        const board = await Board.findById(boardID);
        // if user is only member of board then delete board
        if (board.members.length === 1) {
          // remove board & all of board's lists & activities
          await Promise.all([board.remove(), List.deleteMany({ boardID }), Activity.deleteMany({ boardID })]);
        } else {
          // if user is admin of board then check if theres another admin, if not then promote all other users to admin
          const adminCount = board.members.filter(member => member.email !== user.email && member.isAdmin).length;
          board.members = board.members.filter(member => member.email !== user.email);
          if (!adminCount) {
            board.members = board.members.map(member => ({ ...member, isAdmin: true }));
            const emails = board.members.map(member => member.email);
            await Promise.all([board.save(), User.updateMany({ email: { $in: emails }}, { $push: { adminBoards: boardID }})]);
          } else {
            await board.save();
          }
        }
      }
      res.sendStatus(200);
    } catch (err) { console.log(err); res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.getJWTPayload = getJWTPayload;
module.exports.getLeanJWTPayload = getLeanJWTPayload;
