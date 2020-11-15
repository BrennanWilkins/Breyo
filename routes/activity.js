const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const Activity = require('../models/activity');
const User = require('../models/user');

const addActivity = async (msg, boardMsg, cardID, listID, boardID, userID, email, fullName) => {
  try {
    // email & fullName may be provided & if not then is retrived from user model
    let userEmail; let userFullName;
    if (email && fullName) { userEmail = email; userFullName = fullName; }
    else {
      const user = await User.findById(userID);
      if (!user) { throw 'err'; }
      userEmail = user.email; userFullName = user.fullName;
    }
    const activity = new Activity({ msg, boardMsg, email: userEmail, fullName: userFullName, cardID, listID, boardID, date: new Date() });
    await activity.save();
  } catch (err) { return new Error('Error adding activity'); }
};

router.get('/recent/:boardID', auth, validate([param('boardID').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').limit(20).lean();
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

router.get('/recent/:boardID/:cardID', auth, validate([param('*').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').limit(20).lean();
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

router.get('/all/:boardID/:page', auth, validate([param('boardID').not().isEmpty(), param('page').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const skip = req.params.page * 100;
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').skip(skip).limit(100).lean();
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

router.get('/all/:boardID/:cardID/:page', auth, validate([param('*').not().isEmpty(), param('page').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const skip = req.params.page * 100;
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').skip(skip).limit(100).lean();
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

router.get('/member/:email/:boardID', auth, validate([param('*').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, email: req.params.email }).sort('-date').lean();
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.delete('/:boardID', auth, validate([param('boardID').not().isEmpty()]), useIsAdmin,
  async (req, res) => {
    try {
      await Activity.deleteMany({ boardID: req.params.boardID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.addActivity = addActivity;
