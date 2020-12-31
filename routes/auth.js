const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const List = require('../models/list');
const Board = require('../models/board');
const nodemailer = require('nodemailer');
const { resizeImg, cloudinary } = require('./utils');
const Team = require('../models/team');

const getJWTPayload = user => {
  // create jwt sign payload for easier user data lookup
  const userMembers = {};
  const userAdmins = {};
  for (let board of user.boards) {
    userMembers[board.boardID] = true;
    if (board.isAdmin) { userAdmins[board.boardID] = true; }
  }
  const userTeams = {};
  for (let team of user.teams) {
    if (team._id) { userTeams[team._id] = true; }
    else { userTeams[team] = true; }
  }
  return { email: user.email, userID: user._id, fullName: user.fullName, userMembers, userAdmins, userTeams };
};

const getLeanJWTPayload = user => {
  // create jwt sign payload for user data that hasnt been populated yet
  const userMembers = {};
  const userAdmins = {};
  for (let boardID of user.boards) { userMembers[boardID] = true; }
  for (let boardID of user.adminBoards) { userAdmins[boardID] = true; }
  const userTeams = {};
  for (let team of user.teams) {
    if (team._id) { userTeams[team._id] = true; }
    else { userTeams[team] = true; }
  }
  return { email: user.email, userID: user._id, fullName: user.fullName, userMembers, userAdmins, userTeams };
};

// returns a user's boards/invites/teams to be used on dashboard page
router.get('/userData', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color').populate('teams', 'title boards url').lean();
      if (!user) { throw 'user data not found'; }

      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id)),
        teamID: board.teamID
      }));

      res.status(200).json({ boards: user.boards, invites: user.invites, teams: user.teams, teamInvites: user.teamInvites });
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
      const user = await User.findOne({ email }).populate('boards', 'title color').populate('teams', 'title boards url').lean();

      // return 400 error if no user found
      if (!user) { return res.status(400).json({ msg: 'Incorrect username or password.' }); }

      // verify if correct password
      const same = await bcryptjs.compare(password, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect email or password.' }); }

      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id)),
        teamID: board.teamID
      }));

      // create jwt token that expires in 7 days
      const jwtPayload = getJWTPayload(user);
      const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: '7d' });

      if (user.recoverPassID) { await User.updateOne({ _id: req.userID }, { recoverPassID: null }); }

      const { fullName, invites, boards, avatar, teams, teamInvites } = user;

      res.status(200).json({ token, fullName, email, invites, boards, avatar, teams, teamInvites });
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

      const user = new User({ email, password: hashedPassword, fullName, invites: [], boards: [],
        adminBoards: [], starredBoards: [], recoverPassID: null, avatar: null, teams: [] });
      await user.save();

      // signup was successful, login
      // create jwt token that expires in 7 days
      const jwtPayload = getJWTPayload(user);
      const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: '7d' });

      res.status(200).json({ token, email, fullName, invites: [], boards: [], teams: [], teamInvites: [] });
    } catch(err) { res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

// retrieve user data if userID token already present
router.post('/autoLogin', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color').populate('teams', 'title boards url').lean();
      if (!user) { throw 'User data not found'; }

      user.boards = user.boards.map(board => ({
        boardID: board._id,
        title: board.title,
        color: board.color,
        isStarred: user.starredBoards.includes(String(board._id)),
        isAdmin: user.adminBoards.includes(String(board._id)),
        teamID: board.teamID
      }));

      if (user.recoverPassID) { await User.updateOne({ _id: req.userID }, { recoverPassID: null }); }

      const { email, fullName, invites, boards, avatar, teams, teamInvites } = user;

      res.status(200).json({ email, fullName, invites, boards, avatar, teams, teamInvites });
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

router.delete('/deleteAccount/:password', auth, validate([param('password').not().isEmpty()]),
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      // validate user's password
      const same = await bcryptjs.compare(req.params.password, user.password);
      if (!same) { return res.sendStatus(400); }

      await user.remove();

      for (let boardID of user.boards) {
        const board = await Board.findById(boardID);
        // if user is only member of board then delete board
        if (board.members.length === 1) {
          // remove board & all of board's lists & activities
          await Promise.all([board.remove(), List.deleteMany({ boardID }), Activity.deleteMany({ boardID })]);
        } else {
          // if user is admin of board then check if theres another admin, if not then promote all other users to admin
          const adminCount = board.admins.filter(id => id !== req.userID).length;
          board.members = board.members.filter(id => String(id) !== req.userID);
          if (!adminCount) {
            board.admins = [...board.members];
            await Promise.all([board.save(), User.updateMany({ _id: { $in: board.members }}, { $push: { adminBoards: boardID }})]);
          } else {
            await board.save();
          }

          // remove user from all cards they are a member of
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
        }
      }
      await Team.updateMany({ _id: { $in: user.teams }}, { $pull: { members: user._id }});

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.get('/forgotPassword/:email', validate([param('email').isEmail()]),
  async (req, res) => {
    try {
      const email = req.params.email;
      const user = await User.findOne({ email });
      if (!user) { return res.status(400).json({ msg: 'No user was found for the provided email.' }); }
      // return error if recovery token already present
      if (user.recoverPassID) { return res.status(400).json({ msg: 'A recovery link has already been sent to that email address.'}); }

      // create jwt token that expires in 8hr to recover password
      const recoverPassID = await jwt.sign({ email }, config.get('AUTH_KEY'), { expiresIn: '8h' });

      user.recoverPassID = recoverPassID;
      await user.save();

      // send email to user with link to recover password
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        tls: { rejectUnauthorized: false },
        auth: { user: config.get('BREYO_EMAIL'), pass: config.get('BREYO_PASS') }
      });
      const hRef = `http://localhost:3000/recover-password/${recoverPassID}`;
      const mailOptions = {
        from: config.get('BREYO_EMAIL'),
        to: email,
        subject: 'Recover your Breyo password',
        html: `<h2>Click the link below to change your password.</h2><p><a href="${hRef}">Recover password</a></p>`
      };
      await transporter.sendMail(mailOptions);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/forgotPassword', validate([body('recoverPassID').not().isEmpty(), body('newPassword').isLength({ min: 8, max: 100 })]),
  async (req, res) => {
    try {
      const { recoverPassID, newPassword } = req.body;
      jwt.verify(recoverPassID, config.get('AUTH_KEY'), async (err, decoded) => {
        if (err) {
          if (err.name === 'TokenExpiredError') {
            const user = await User.updateOne({ email: decoded.email }, { recoverPassID: null });
            return res.status(400).json({ msg: 'Your recovery link has expired.' });
          }
          throw err;
        }
        try {
          const hashedPass = await bcryptjs.hash(newPassword, 10);
          await User.updateOne({ email: decoded.email }, { recoverPassID: null, password: hashedPass });
        } catch (err) { throw err; }
      });

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/avatar', auth, validate([body('avatar').not().isEmpty()]),
  async (req, res) => {
    try {
      const avatar = await resizeImg(req.body.avatar);

      const data = await cloudinary.upload(avatar);
      const url = data.secure_url;
      const user = await User.findByIdAndUpdate(req.userID, { avatar: url }).select('avatar').lean();
      if (user.avatar) {
        // delete old avatar picture
        await cloudinary.destroy(user.avatar.slice(user.avatar.lastIndexOf('/') + 1, user.avatar.lastIndexOf('.')));
      }

      res.status(200).json({ url });
    } catch (err) {  res.sendStatus(500); }
  }
);

router.delete('/avatar', auth,
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.userID, { avatar: null }).select('avatar').lean();
      await cloudinary.destroy(user.avatar.slice(user.avatar.lastIndexOf('/') + 1, user.avatar.lastIndexOf('.')));
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.getJWTPayload = getJWTPayload;
module.exports.getLeanJWTPayload = getLeanJWTPayload;
