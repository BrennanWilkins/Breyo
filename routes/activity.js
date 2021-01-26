const router = require('express').Router();
const { param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const Activity = require('../models/activity');

router.use(auth);

// for every action addActivity is called to create new doc in activity collection
const addActivity = async (data, req) => {
  try {
    const { msg, boardMsg, cardID, listID, boardID, email, fullName } = data;
    if (!req.email || !req.fullName) { throw 'User data not found'; }
    const activity = new Activity({ msg, boardMsg, email: email || req.email, fullName: fullName || req.fullName,
      cardID, listID, boardID, date: new Date(), commentID: data.commentID || null, cardTitle: data.cardTitle || null });
    const newActivity = await activity.save();
    return newActivity;
  } catch (err) { return new Error('Error adding activity'); }
};

// authorization: member
// returns last 20 board actions
router.get('/recent/board/:boardID',
  validate([param('boardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// returns last 20 actions for given card
router.get('/recent/card/:boardID/:cardID',
  validate([param('boardID').isMongoId(), param('cardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No card activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// returns a given page of board activity sorted by most recent, each page returns 100 actions
// use if want to support activity pagination/more than 200 activities
// router.get('/all/board/:boardID/:page',
//   validate([param('boardID').isMongoId(), param('page').isInt()]),
//   useIsMember,
//   async (req, res) => {
//     try {
//       const skip = req.params.page * 100;
//       const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').skip(skip).limit(100).lean();
//       if (!activity) { throw 'No board activity found'; }
//       res.status(200).json({ activity });
//     } catch (err) { res.sendStatus(500); }
//   }
// );

// authorization: member
// returns first 100 activities for a board sorted by most recent
router.get('/all/board/:boardID/firstPage',
  validate([param('boardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').limit(100).lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// returns all activities for a board sorted by most recent
router.get('/all/board/:boardID/allActions',
  validate([param('boardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID }).sort('-date').skip(100).lean();
      if (!activity) { throw 'No board activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// returns all actions for given card
router.get('/all/card/:boardID/:cardID',
  validate([param('boardID').isMongoId(), param('cardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const activity = await Activity.find({ boardID: req.params.boardID, cardID: req.params.cardID }).sort('-date').lean();
      if (!activity) { throw 'No card activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// returns all activity for given board member
router.get('/member/:email/:boardID',
  validate([param('boardID').isMongoId(), param('email').isEmail()]),
  useIsMember,
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
router.delete('/:boardID',
  validate([param('boardID').isMongoId()]),
  useIsAdmin,
  async (req, res) => {
    try {
      await Activity.deleteMany({ boardID: req.params.boardID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// returns all of user's activity sorted by page (each page returns 100 activity) & by date
router.get('/myActivity/:page',
  validate([param('page').isInt()]),
  async (req, res) => {
    try {
      const skip = req.params.page * 100;
      const activity = await Activity.find({ email: req.email }).sort('-date').skip(skip).limit(100).lean();
      if (!activity) { throw 'No user activity found'; }
      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
module.exports.addActivity = addActivity;
