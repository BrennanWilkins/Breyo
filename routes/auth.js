const router = require('express').Router();
const User = require('../models/user');
const { body, param } = require('express-validator');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const config = require('config');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const nodemailer = require('nodemailer');
const { formatUserBoards } = require('./user');

const getJWTPayload = user => {
  // create jwt sign payload for easier user data lookup in middleware
  const userMembers = {};
  for (let board of user.boards) {
    if (board.boardID) { userMembers[board.boardID] = true; }
    else { userMembers[board] = true; }
  }
  const userAdmins = {};
  for (let boardID of user.adminBoards) { userAdmins[boardID] = true; }
  const userTeams = {};
  for (let team of user.teams) {
    if (team._id) { userTeams[team._id] = true; }
    else { userTeams[team] = true; }
  }
  const userAdminTeams = {};
  for (let teamID of user.adminTeams) { userAdminTeams[teamID] = true; }

  return { email: user.email, userID: user._id, fullName: user.fullName, userMembers, userAdmins, userTeams, userAdminTeams };
};

// creates new jwt token if users token is not up to date
const signNewToken = async (user, oldToken) => {
  const decoded = jwt.decode(oldToken);
  const jwtPayload = getJWTPayload(user);
  // token expires at same time as oldToken
  const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: decoded.exp });
  return token;
};

const signInitialToken = async user => {
  // create jwt token that expires in 7 days when logging in
  const jwtPayload = getJWTPayload(user);
  const token = await jwt.sign({ user: jwtPayload }, config.get('AUTH_KEY'), { expiresIn: '7d' });
  return token;
};

// login
router.post('/',
  validate([body('email').isEmail(), body('password').notEmpty()], 'Email and password cannot be empty.'),
  async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await User.findOne({ email }).populate('boards', 'title color teamID').populate('teams', 'title url').lean();

      // return 400 error if no user found
      if (!user) { return res.status(400).json({ msg: 'Incorrect username or password.' }); }

      // verify if correct password
      const same = await bcryptjs.compare(password, user.password);
      if (!same) { return res.status(400).json({ msg: 'Incorrect email or password.' }); }

      user.boards = formatUserBoards(user);

      const token = await signInitialToken(user);

      if (user.recoverPassID) { await User.updateOne({ _id: req.userID }, { recoverPassID: null }); }

      const { fullName, invites, boards, avatar, teams, teamInvites, adminTeams } = user;

      res.status(200).json({ token, fullName, email, invites, boards, avatar, teams, teamInvites, adminTeams });
    } catch(err) { return res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

router.post('/signup',
  validate(
    [body('email').isEmail(),
    body('fullName').isLength({ min: 1, max: 100 }),
    body('password').isLength({ min: 8, max: 100 }),
    body('confirmPassword').isLength({ min: 8, max: 100 })],
    'There was an error in one of the fields.'
  ),
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
        adminBoards: [], starredBoards: [], recoverPassID: null, avatar: null, teams: [], adminTeams: [] });
      await user.save();

      // signup was successful, login
      const token = await signInitialToken(user);

      res.status(200).json({ token, email, fullName, invites: [], boards: [], teams: [], teamInvites: [], adminTeams: [] });
    } catch(err) { res.status(500).json({ msg: 'There was an error while logging in.' }); }
  }
);

// retrieve user data if userID token already present
router.get('/',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color teamID').populate('teams', 'title url').lean();
      if (!user) { throw 'User data not found'; }

      user.boards = formatUserBoards(user);

      if (user.recoverPassID) { await User.updateOne({ _id: req.userID }, { recoverPassID: null }); }

      const { _id, adminBoards, password, __v, starredBoards, recoverPassID, ...userData } = user;
      res.status(200).json({ ...userData });
    } catch(err) { res.sendStatus(500); }
  }
);

// returns new token if user's token not up to date
router.get('/newToken',
  auth,
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).lean();
      const token = await signNewToken(user, req.header('x-auth-token'));
      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/changePass',
  auth,
  validate(
    [body('newPassword').isLength({ min: 8, max: 100 }),
    body('confirmPassword').isLength({ min: 8, max: 100 }),
    body('oldPassword').notEmpty()],
    'There is an error in one of the fields.'
  ),
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

router.get('/forgotPassword/:email',
  validate([param('email').isEmail()]),
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
      // const hRef = `http://localhost:3000/recover-password/${recoverPassID}`;
      const hRef = `https://breyo.herokuapp.com/recover-password/${recoverPassID}`;
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

router.post('/forgotPassword',
  validate([body('recoverPassID').notEmpty(), body('newPassword').isLength({ min: 8, max: 100 })]),
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

router.post('/feedback',
  auth,
  validate([body('email').exists(), body('msg').isLength({ min: 1, max: 1000 })]),
  async (req, res) => {
    try {
      const { email, msg } = req.body;

      const transporter = nodemailer.createTransport({
        service: 'gmail',
        secure: false,
        tls: { rejectUnauthorized: false },
        auth: { user: config.get('BREYO_EMAIL'), pass: config.get('BREYO_PASS') }
      });
      const mailOptions = {
        from: config.get('BREYO_EMAIL'),
        to: config.get('BREYO_EMAIL'),
        subject: `Breyo feedback from ${req.fullName}`,
        html: `<p>Provided email: ${email || 'No email provided'}</p><p>User email: ${req.email}</p><p>${msg}</p>`
      };
      await transporter.sendMail(mailOptions);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.signNewToken = signNewToken;
