const router = require('express').Router();
const Team = require('../models/team');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const { param, body } = require('express-validator');
const User = require('../models/user');
const { cloudinary, resizeImg, nanoid } = require('./utils');
const Activity = require('../models/activity');
const Board = require('../models/board');
const { signNewToken } = require('./board');
const useIsTeamMember = require('../middleware/useIsTeamMember');

const validateURL = async url => {
  try {
    // validate URL
    const urlTest = /^[a-zA-Z0-9]*$/;
    const checkURL = urlTest.test(url);
    // check if URL is already taken
    if (!checkURL) { return `Your team's URL can only contain letters or numbers.`; }
    const isTaken = await Team.exists({ url });
    if (isTaken) { return 'That URL is already taken.'; }
  } catch (err) { return err; }
};

// authorization: team member
router.get('/:teamID', auth, validate([param('teamID').not().isEmpty()]), useIsTeamMember,
  async (req, res) => {
    try {
      const team = await Team.findById(req.params.teamID).populate('members', 'email fullName avatar').select('-boards').lean();
      if (!team) { throw 'Team not found'; }
      res.status(200).json({ team });
    } catch (err) { res.sendStatus(500); }
  }
);

// check if team URL is taken
router.get('/checkURL/:url', auth, validate([param('url').isLength({ min: 1, max: 50 })]),
  async (req, res) => {
    try {
      const isTaken = await Team.exists({ url: req.params.url });
      res.status(200).json({ isTaken });
    } catch (err) { res.sendStatus(500); }
  }
);

// create a new team
router.post('/', auth, validate(
  [body('title').isLength({ min: 1, max: 100 }),
  body('desc').isLength({ min: 0, max: 400 }),
  body('url').isLength({ min: 0, max: 50 }),
  body('members').exists()]),
  async (req, res) => {
    try {
      const { title, desc, url, members } = req.body;

      if (url !== '') {
        const urlIsValid = validateURL(url);
        if (urlIsValid !== '') { return res.status(400).json({ msg: urlIsValid }); }
      }

      const team = new Team({ title, desc, url, logo: null, members: [req.userID], boards: [] });
      team.url = team.url === '' ? nanoid() : team.url;

      const user = await User.findById(req.userID);
      user.teams.push(team._id);


      if (members !== '') {
        // members sent as emails separated by space, if user found then send invite
        const emails = members.trim().split(' ');
        const users = [];
        for (let email of emails) {
          if (email === req.email) { continue; }
          const user = await User.findOne({ email });
          if (!user) { return res.status(400).json({ msg: `There is no user for the email '${email}' that you provided.` }); }
          user.teamInvites.push({ inviterEmail: req.email, inviterName: req.fullName, title, teamID: team._id });
          users.push(user);
        }
      }

      const results = await Promise.all([
        signNewToken(user, req.header('x-auth-token'), true),
        team.save(),
        user.save(),
        ...users.map(user => user.save())
      ]);
      const token = results[0];

      res.status(200).json({ teamID: team._id, url: team.url, token });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: team member
// edit a teams info
router.put('/', auth, validate(
  [body('title').isLength({ min: 1, max: 100 }),
  body('desc').isLength({ min: 0, max: 400 }),
  body('url').isLength({ min: 0, max: 50 }),
  body('teamID').isMongoId()]), useIsTeamMember,
  async (req, res) => {
    try {
      const { title, desc, url, teamID } = req.body;
      const team = await Team.findById(teamID);
      if (!team) { throw 'Team not found'; }

      if (url !== '' && url !== team.url) {
        const urlIsValid = validateURL(url);
        if (urlIsValid !== '') { return res.status(400).json({ msg: urlIsValid }); }
      }

      team.title = title;
      team.desc = desc;
      if (url !== '' && url !== team.url) { team.url = url; }

      await team.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: team member
// delete a team, deletes all of team's boards
router.delete('/:teamID', auth, validate([param('teamID').isMongoId()]), useIsTeamMember,
  async (req, res) => {
    try {
      const team = await Team.findById(req.params.teamID);
      for (let boardID of team.boards) {
        const board = await Board.findById(boardID);
        await Promise.all([
          board.remove(),
          User.updateMany({ _id: { $in: board.members }}, { $pull: { boards: boardID, adminBoards: boardID, starredBoards: boardID } }),
          List.deleteMany({ boardID }),
          Activity.deleteMany({ boardID })
        ]);
      }

      await Promise.all([
        team.remove(),
        User.updateMany({ _id: { $in: team.members }}, { $pull: { teams: team._id }}),
        cloudinary.destroy(team.logo.slice(team.logo.lastIndexOf('/') + 1, team.logo.lastIndexOf('.')))
      ]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: team member
// change team's logo
router.put('/logo', auth, validate([body('teamID').isMongoId(), body('logo').not().isEmpty()]), useIsTeamMember,
  async (req, res) => {
    try {
      const logo = await resizeImg(req.body.logo);

      const data = await cloudinary.upload(logo);
      const logoURL = data.secure_url;
      const team = await Team.findByIdAndUpdate(req.body.teamID, { logo: logoURL }).select('logo').lean();
      if (team.logo) {
        // delete old logo
        await cloudinary.destroy(team.logo.slice(team.logo.lastIndexOf('/') + 1, team.logo.lastIndexOf('.')));
      }

      res.status(200).json({ logoURL });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: team member
// delete a team's logo
router.delete('/logo/:teamID', auth, validate([param('teamID').isMongoId()]), useIsTeamMember,
  async (req, res) => {
    try {
      const team = await Team.findByIdAndUpdate(req.params.teamID, { logo: null }).select('logo').lean();
      await cloudinary.destroy(team.logo.slice(team.logo.lastIndexOf('/') + 1, team.logo.lastIndexOf('.')));
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: team member
// invite users to join team
router.post('/invites', auth, validate([body('members').not().isEmpty(), body('teamID').isMongoId()]), useIsTeamMember,
  async (req, res) => {
    try {
      const { members, teamID } = req.body;
      const team = await Team.findById(teamID).select('title').lean();
      // members sent as emails separated by space, if user found then send invite
      const emails = members.trim().split(' ');
      const users = [];
      for (let email of emails) {
        if (email === req.email) { continue; }
        const user = await User.findOne({ email });
        if (!user) { return res.status(400).json({ msg: `There is no user for the email '${email}' that you provided.` }); }
        // user already invited
        if (user.teamInvites.find(invite => String(invite.teamID) === teamID)) {
          return res.status(400).json({ msg: `You have already invited '${email}' to this team.` });
        }
        // user already member
        if (user.teams.find(teamID => String(teamID) === teamID)) {
          return res.status(400).json({ msg: `The user '${email}' is already a member of this team.` });
        }
        user.teamInvites.push({ inviterEmail: req.email, inviterName: req.fullName, title: team.title, teamID: team._id });
        users.push(user);
      }
      await Promise.all([...users.map(user => user.save())]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// accept invite to join team
router.put('/invites/accept', auth, validate([body('teamID').isMongoId()]),
  async (req, res) => {
    try {
      const teamID = req.body.teamID;
      const [team, user] = await Promise.all([Team.findById(teamID), User.findById(req.userID)]);
      if (!user) { throw 'User data not found'; }

      user.teamInvites = user.teamInvites.filter(invite => String(invite.teamID) !== teamID);

      if (!team) {
        // team no longer exists
        await user.save();
        return res.status(400).json({ msg: 'This team no longer exists.' });
      }

      team.members.push(req.userID);
      user.teams.push(teamID);

      const results = await Promise.all([
        signNewToken(user, req.header('x-auth-token'), true),
        team.save(),
        user.save()
      ]);
      const token = results[0];
      const teamData = { teamID: team._id, url: team.url, title: team.title };

      res.status(200).json({ token, team: teamData });
    } catch (err) { res.sendStatus(500); }
  }
);

// reject invite to join a team
router.put('/invites/reject', auth, validate([body('teamID').isMongoId()]),
  async (req, res) => {
    try {
      const teamID = req.body.teamID;
      const user = await User.findById(req.userID);
      if (!user) { throw 'User data not found'; }

      user.teamInvites = user.teamInvites.filter(invite => invite.teamID !== teamID);
      await user.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// leave a team
router.put('/leave', auth, validate([body('teamID').isMongoId()]), useIsTeamMember,
  async (req, res) => {
    try {
      const teamID = req.body.teamID;
      const [team, user] = await Promise.all([Team.findById(teamID), User.findById(req.userID)]);
      if (!team || !user) { throw 'No team or user data found'; }

      if (team.members.length === 1) { return res.status(400).json({ msg: 'You cannot leave a team if you are the only member.' }); }

      team.members = team.members.filter(id => String(id) !== req.userID);
      user.teams = user.teams.filter(id => String(id) !== teamID);

      const results = await Promise.all([
        signNewToken(user, req.header('x-auth-token'), true),
        team.save(),
        user.save()
      ]);
      const token = results[0];

      res.status(200).json({ token });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
