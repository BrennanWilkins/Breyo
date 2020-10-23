const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

router.post('/login', validate(
  [body('*').escape(),
  body('username').not().isEmpty().trim(),
  body('password').not().isEmpty().trim()],
  'Username and password cannot be empty.'),
  async (req, res) => {
    try {
      const user = req.body.username.indexOf('@') > 0 ?
      await User.findOne({ email: req.body.username }) :
      await User.findOne({ username: req.body.username });
      // return 400 error if no user found
      if (!user) { return res.status(400).json({ msg: 'Incorrect username or password.' }); }
      const same = await bcryptjs.compare(req.body.password, user.password);
      // return 400 error if password incorrect
      if (!same) { return res.status(400).json({ msg: 'Incorrect email or password.' }); }
      // create jwt token that expires in 7 days
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: '7d' });
      res.status(200).json({ token, displayName: user.displayName, email: user.email,
        invites: user.invites, boards: user.boards, activity: user.activity });
    } catch(err) { return res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

router.get('/signup/verifyUsername/:username',
  [param('username').escape()],
  async (req, res) => {
    try {
      const checkUser = User.findOne({ username: req.params.username });
      // send 400 code if username taken, else send 200
      if (checkUser) { return res.status(400); }
      res.status(200);
    } catch(err) { return res.status(500); }
  }
);

router.post('/signup', validate(
  [body('*').escape(),
  body('email').isEmail().normalizeEmail(),
  body('username').not().isEmpty().trim(),
  body('displayName').not().isEmpty().trim(),
  body('password').trim().isLength({ min: 8, max: 100 }),
  body('confirmPassword').trim().isLength({ min: 8, max: 100 })],
  'There was an error in one of the fields.'),
  async (req, res) => {
    try {
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ msg: 'Password must be equal to confirm password.' });
      }
      const checkEmail = await User.findOne({ email: req.body.email });
      const checkUsername = await User.findOne({ username: req.body.username });
      // if email already taken
      if (checkEmail) { return res.status(400).json({ msg: 'That email is already taken.' }); }
      if (checkUsername) { return res.status(400).json({ msg: 'That username is already taken.' }); }
      const hashedPassword = await bcryptjs.hash(req.body.password, 10);
      const user = new User({ username: req.body.username, email: req.body.email, password: hashedPassword,
        displayName: req.body.displayName, invites: [], boards: [], activity: [] });
      await user.save();
      // signup was successful, login
      // create jwt token that expires in 7 days
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: '7d' });
      res.status(200).json({ token, username: user.username, email: user.email,
         displayName: user.displayName, invites: [], boards: [], activity: [] });
    } catch(err) { return res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

router.post('/autoLogin', auth,
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userID });
      if (!user) { throw 'err'; }
      res.status(200).json({ username: user.username, email: user.email,
        displayName: user.displayName, invites: user.invites, boards: user.boards, activity: user.activity });
    } catch(err) { return res.status(500); }
  }
);

router.post('/changePass', auth, validate(
  [body('*').not().isEmpty().trim().escape(),
  body('newPassword').isLength({ min: 8, max: 100 })]
  ,'The input fields cannot be empty.'),
  async (req, res) => {
    try {
      const user = await User.findOne({ _id: req.userID });
      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ msg: 'Confirm password must be equal to your new password.' });
      }
      const same = await bcryptjs.compare(req.body.oldPassword, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect password.' }); }
      const hashedPass = await bcryptjs.hash(req.body.newPassword, 10);
      user.password = hashedPass;
      await user.save();
      res.sendStatus(200);
    } catch(err) { return res.status(500); }
  }
);

module.exports = router;
