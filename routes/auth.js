const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { body } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');

// returns a user's boards & invites to be used on dashboard page
router.get('/userData', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
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
      const user = await User.findOne({ email: req.body.email });
      // return 400 error if no user found
      if (!user) { return res.status(400).json({ msg: 'Incorrect username or password.' }); }
      const same = await bcryptjs.compare(req.body.password, user.password);
      // return 400 error if password incorrect
      if (!same) { return res.status(400).json({ msg: 'Incorrect email or password.' }); }
      // create jwt token that expires in 7 days
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: '7d' });
      res.status(200).json({ token, fullName: user.fullName, email: user.email,
        invites: user.invites, boards: user.boards });
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
      // user full name must be characters a-z or A-Z
      if (!req.body.fullName.match(/^[ a-zA-Z]+$/)) {
        return res.status(400).json({ msg: 'Please enter a valid full name.' });
      }
      if (req.body.password !== req.body.confirmPassword) {
        return res.status(400).json({ msg: 'Password must be equal to confirm password.' });
      }
      const checkEmail = await User.findOne({ email: req.body.email });
      // if email already taken
      if (checkEmail) { return res.status(400).json({ msg: 'That email is already taken.' }); }
      const hashedPassword = await bcryptjs.hash(req.body.password, 10);
      const user = new User({ email: req.body.email, password: hashedPassword,
        fullName: req.body.fullName, invites: [], boards: [] });
      await user.save();
      // signup was successful, login
      // create jwt token that expires in 7 days
      const token = await jwt.sign({ user }, config.get('AUTH_KEY'), { expiresIn: '7d' });
      res.status(200).json({ token, email: user.email, fullName: user.fullName, invites: [], boards: [] });
    } catch(err) { res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

// retrieve user data if userID token already present
router.post('/autoLogin', auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      if (!user) { throw 'User data not found'; }
      res.status(200).json({ email: user.email, fullName: user.fullName, invites: user.invites, boards: user.boards });
    } catch(err) { res.sendStatus(500); }
  }
);

router.post('/changePass', auth, validate([body('newPassword').isLength({ min: 8, max: 100 })],'There is an error in one of the fields.'),
  async (req, res) => {
    try {
      const user = await User.findById(req.userID);
      if (req.body.newPassword !== req.body.confirmPassword) {
        return res.status(400).json({ msg: 'Confirm password must be equal to your new password.' });
      }
      // confirm that user entered old password correct
      const same = await bcryptjs.compare(req.body.oldPassword, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect password.' }); }
      const hashedPass = await bcryptjs.hash(req.body.newPassword, 10);
      user.password = hashedPass;
      await user.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

module.exports = router;
