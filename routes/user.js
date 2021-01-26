const router = require('express').Router();
const User = require('../models/user');
const { body, param } = require('express-validator');
const bcryptjs = require('bcryptjs');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const List = require('../models/list');
const Board = require('../models/board');
const { resizeImg, cloudinary } = require('./utils');
const Team = require('../models/team');

const formatUserBoards = user => {
  const formatted = user.boards.map(board => ({
    boardID: board._id,
    title: board.title,
    color: board.color,
    isStarred: user.starredBoards.includes(String(board._id)),
    isAdmin: user.adminBoards.includes(String(board._id)),
    teamID: board.teamID
  }));
  return formatted;
};

const leaveAllCards = async (boardID, email) => {
  // remove user from all cards they are a member of for given board
  const lists = await List.find({ boardID });
  for (let list of lists) {
    let shouldUpdate = false;
    for (let card of list.cards) {
      for (let i = card.members.length - 1; i >= 0; i--) {
        if (card.members[i].email === email) { card.members.splice(i, 1); }
        shouldUpdate = true;
      }
    }
    // only need to update list if member changed
    if (shouldUpdate) { await list.save(); }
  }
};

router.use(auth);

// returns a user's boards/invites/teams to be used on dashboard page
router.get('/',
  async (req, res) => {
    try {
      const user = await User.findById(req.userID).populate('boards', 'title color teamID').populate('teams', 'title url').lean();
      if (!user) { throw 'user data not found'; }

      user.boards = formatUserBoards(user);

      res.status(200).json({ boards: user.boards, invites: user.invites, teams: user.teams, teamInvites: user.teamInvites, adminTeams: user.adminTeams });
    } catch (err) { res.sendStatus(500); }
  }
);

router.delete('/deleteAccount/:password',
  validate([param('password').notEmpty()]),
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

          await leaveAllCards(boardID, user.email);
        }
      }
      await Team.updateMany({ _id: { $in: user.teams }}, { $pull: { members: user._id, admins: req.userID }});

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/avatar',
  validate([body('avatar').notEmpty()]),
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

router.delete('/avatar',
  async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(req.userID, { avatar: null }).select('avatar').lean();
      if (!user.avatar) { throw 'Users avatar already deleted'; }
      await cloudinary.destroy(user.avatar.slice(user.avatar.lastIndexOf('/') + 1, user.avatar.lastIndexOf('.')));
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.formatUserBoards = formatUserBoards;
module.exports.leaveAllCards = leaveAllCards;
