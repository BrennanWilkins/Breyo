const express = require('express');
const router = express.Router();
const { param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const Activity = require('../models/activity');
const User = require('../models/user');

// for every action addActivity is called to create new doc in activity collection
const addActivity = async (msg, boardMsg, cardID, listID, boardID, userID, email, fullName) => {
  try {
    // email & fullName may be provided & if not then is retrived from user model
    let userEmail; let userFullName;
    if (email && fullName) { userEmail = email; userFullName = fullName; }
    else {
      const user = await User.findById(userID);
      if (!user) { throw 'No user found'; }
      userEmail = user.email; userFullName = user.fullName;
    }
    const activity = new Activity({ msg, boardMsg, email: userEmail, fullName: userFullName, cardID, listID, boardID, date: new Date() });
    const newActivity = await activity.save();
    // board stores max past 200 actions
    const allActivity = await Activity.find({ boardID }).sort('-date').skip(200);
    for (let oldAction of allActivity) { oldAction.remove(); }
    return newActivity;
  } catch (err) { return new Error('Error adding activity'); }
};

// returns last 20 board actions
router.get('/recent/board/:boardID', auth, validate([param('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// returns last 20 actions for given card
router.get('/recent/card/:boardID/:cardID', auth, validate([param('*').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No card activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// returns a given page of board activity sorted by most recent, each page returns 100 actions
// use if want to support activity pagination/more than 200 activities
// router.get('/all/board/:boardID/:page', auth, validate([param('boardID').isMongoId(), param('page').isInt()]), useIsMember,
//   async (req, res) => {
//     try {
//       const skip = req.params.page * 100;
//       const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').skip(skip).limit(100).lean();
//       if (!activity) { throw 'No board activity found'; }
//       res.status(200).json({ activity });
//     } catch (err) { res.sendStatus(500); }
//   }
// );

// returns first 100 activities for a board sorted by most recent
router.get('/all/board/:boardID/firstPage', auth, validate([param('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').limit(100).lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// returns all activities for a board sorted by most recent
router.get('/all/board/:boardID/allActions', auth, validate([param('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// returns all actions for given card
router.get('/all/card/:boardID/:cardID', auth, validate([param('*').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').lean();
      if (!activity) { throw 'No card activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// returns all activity for given board member
router.get('/member/:email/:boardID', auth, validate([param('boardID').isMongoId(), param('email').isEmail()]), useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, email: req.params.email }).sort('-date').lean();
      if (!activity) { throw 'No member activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// deletes all board activity
router.delete('/:boardID', auth, validate([param('boardID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      await Activity.deleteMany({ boardID: req.params.boardID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.addActivity = addActivity;
