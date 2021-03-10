const router = require('express').Router();
const Board = require('../models/board');
const List = require('../models/list');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');

router.use(auth);

// authorization: board member
// create a new list
router.post('/',
  validate([body('boardID').isMongoId(), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, title } = req.body;
      const [board, listsLength] = await Promise.all([Board.exists({ _id: boardID }), List.countDocuments({ boardID, isArchived: false })]);
      if (!board) { throw 'New lists board not found'; }

      const list = new List({ boardID, title, cards: [], archivedCards: [], indexInBoard: listsLength,
        isArchived: false, isVoting: false, limit: null });
      const listID = list._id;

      const actionData = { msg: null, boardMsg: `added list ${title} to this board`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ listID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// update list title
router.put('/title',
  validate([body('boardID').isMongoId(), body('listID').isMongoId(), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, title } = req.body;
      const list = await List.findOneAndUpdate({ _id: listID, boardID, isArchived: false }, { title }).select('title').lean();
      if (!list) { throw 'List data not found'; }
      const oldTitle = list.title;

      const actionData = { msg: null, boardMsg: `renamed list ${oldTitle} to ${title}`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const newActivity = await addActivity(actionData);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: board member
// move list to different index in board
router.put('/moveList',
  validate([body('sourceIndex').isInt({ min: 0 }), body('destIndex').isInt({ min: 0 }), body('boardID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const { sourceIndex, destIndex, boardID } = req.body;
      const lists = await List.find({ boardID, isArchived: false }).sort({ indexInBoard: 'asc' });
      if (!lists) { throw 'List data not found'; }
      if (sourceIndex >= lists.length || destIndex >= lists.length) {
        throw 'Invalid source or dest index';
      }
      const list = lists.splice(sourceIndex, 1)[0];
      lists.splice(destIndex, 0, list);

      // update all lists in board to match new order
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) { lists[i].indexInBoard = i; }
      }
      await Promise.all(lists.map(list => list.save()));

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// create a copy of a list
router.post('/copy',
  validate([body('boardID').isMongoId(), body('listID').isMongoId(), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, title } = req.body;
      const [list, listsLength] = await Promise.all([
        List.findOne({ _id: listID, boardID, isArchived: false }).select('cards desc title').lean(),
        List.countDocuments({ boardID, isArchived: false })
      ]);
      if (!list || !listsLength) { throw 'List data not found'; }

      // create deeply nested copy of all cards & all checklists/members/dueDate/etc of each card
      const cards = list.cards.map(card => ({
        title: card.title,
        desc: card.desc,
        checklists: card.checklists.map(checklist => ({
          title: checklist.title,
          items: checklist.items.map(item => ({
            title: item.title,
            isComplete: item.isComplete
          }))
        })),
        labels: card.labels,
        dueDate: card.dueDate,
        members: card.members,
        customFields: card.customFields.map(field => ({
          fieldType: field.fieldType,
          fieldTitle: field.fieldTitle,
          value: field.value
        })),
        comments: [],
        votes: [],
        customLabels: card.customLabels
      }));

      const newList = new List({ boardID, title, desc: list.desc, indexInBoard: listsLength, cards, archivedCards: [],
        isArchived: false, isVoting: false, limit: list.limit });

      const listActivity = new Activity({ msg: null, boardMsg: `added list ${title} to this board`, cardID: null, listID: newList._id,
        boardID, email: req.email, fullName: req.fullName, date: new Date() });

      const actions = [listActivity, ...newList.cards.map(card => (
        new Activity({
          msg: `copied this card from ${card.title} in list ${list.title}`,
          boardMsg: `copied **(link)${card.title}** from ${card.title} in list ${list.title}`,
          cardID: card._id,
          listID: newList._id,
          boardID,
          date: new Date(),
          email: req.email,
          fullName: req.fullName
        }))
      )];

      const [activities] = await Promise.all([Activity.insertMany(actions), newList.save()]);

      res.status(200).json({ newList, activities });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board admin
// send list to archive
router.post('/archive',
  validate([body('boardID').isMongoId(), body('listID').isMongoId()]),
  useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, listID } = req.body;
      const lists = await List.find({ boardID, isArchived: false }).sort({ indexInBoard: 'asc' });
      if (!lists || !lists.length) { throw 'List data not found'; }
      const listIndex = lists.findIndex(list => String(list._id) === listID);
      if (listIndex === -1) { throw 'List not found in boards lists'; }

      const archivedList = lists.splice(listIndex, 1)[0];
      archivedList.indexInBoard = lists.length;
      archivedList.isArchived = true;

      // update all lists index in board to reflect missing list
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) { lists[i].indexInBoard = i; }
      }

      const actionData = { msg: null, boardMsg: `archived list ${archivedList.title}`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), archivedList.save(), ...lists.map(list => list.save())]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// send list to board from archive
router.put('/archive/recover',
  validate([body('boardID').isMongoId(), body('listID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID } = req.body;
      const listsLength = await List.countDocuments({ boardID, isArchived: false });
      if (!listsLength) { throw 'Lists data not found'; }
      const list = await List.findOneAndUpdate({ _id: listID, boardID }, { indexInBoard: listsLength, isArchived: false }).select('title').lean();
      if (!list) { throw 'List not found'; }

      const actionData = { msg: null, boardMsg: `recovered list ${list.title}`, cardID: null, listID, boardID, email: req.email, fullName: req.fullName };
      const newActivity = await addActivity(actionData);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: board admin
// Permanently delete a list
router.delete('/archive/:listID/:boardID',
  validate([param('boardID').isMongoId(), param('listID').isMongoId()]),
  useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, listID } = req.params;
      const list = await List.findOneAndDelete({ _id: listID, boardID }).select('title').lean();
      if (!list) { throw 'List not found'; }

      const actionData = { msg: null, boardMsg: `deleted list ${list.title}`, cardID: null, listID: null, boardID, email: req.email, fullName: req.fullName };
      await addActivity(actionData);

      // delete all of lists activities & return new recent activities
      await Activity.deleteMany({ listID });
      const activity = await Activity.find({ boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }

      res.status(200).json({ activity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: board member
// Send all cards in list to archive
router.put('/archive/allCards',
  validate([body('boardID').isMongoId(), body('listID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID } = req.body;
      const list = await List.findOne({ _id: listID, boardID, isArchived: false });
      if (!list) { throw 'List data not found'; }

      // set all cards to isArchived & add action for each card
      const actionData = list.cards.map(card => (
        new Activity({
          msg: `archived this card`,
          boardMsg: `archived **(link)${card.title}**`,
          cardID: card._id,
          listID,
          boardID,
          email: req.email,
          fullName: req.fullName,
          date: new Date()
        })
      ));

      list.archivedCards = list.archivedCards.concat(list.cards);
      list.cards = [];

      const [activities] = await Promise.all([Activity.insertMany(actionData), list.save()]);

      res.status(200).json({ activities });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: board member
// move all cards in a list to another list
router.put('/moveAllCards',
  validate([body('boardID').isMongoId(), body('oldListID').isMongoId(), body('newListID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const { oldListID, newListID, boardID } = req.body;
      const [oldList, newList] = await Promise.all([
        List.findOne({ _id: oldListID, boardID, isArchived: false }),
        List.findOne({ _id: newListID, boardID, isArchived: false })
      ]);
      if (!oldList || !newList) { throw 'Old list or new list data not found'; }

      newList.cards = newList.cards.concat(oldList.cards);
      newList.archivedCards = newList.archivedCards.concat(oldList.archivedCards);
      oldList.cards = [];
      oldList.archivedCards = [];

      await Promise.all([
        oldList.save(),
        newList.save(),
        Activity.updateMany({ listID: oldListID }, { listID: newListID })
      ]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board admin
// start or close a vote on the list
router.post('/voting',
  validate([body('boardID').isMongoId(), body('listID').isMongoId()]),
  useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, listID } = req.body;
      const list = await List.findOne({ boardID, _id: listID, isArchived: false });
      if (!list) { throw 'List not found'; }

      for (let card of list.cards) { card.votes = []; }
      list.isVoting = !list.isVoting;

      const actionData = { msg: null, boardMsg: `${list.isVoting ? 'started a vote' : 'closed voting'} on ${list.title}`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// set a limit to number of cards in list
router.put('/limit',
  validate([body('boardID').isMongoId(), body('listID').isMongoId(), body('limit').isInt({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, limit } = req.body;
      const list = await List.findOne({ boardID, _id: listID, isArchived: false });
      if (!list) { throw 'List not found'; }
      list.limit = +limit;

      const actionData = { msg: null, boardMsg: `set the card limit on ${list.title} to ${limit}`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// remove the card limit from a list
router.delete('/limit/:boardID/:listID',
  validate([param('boardID').isMongoId(), param('listID').isMongoId()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID } = req.params;
      const list = await List.findOne({ boardID, _id: listID, isArchived: false });
      if (!list) { throw 'List not found'; }
      list.limit = null;

      const actionData = { msg: null, boardMsg: `removed the card limit from ${list.title}`,
      cardID: null, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: board member
// sort the cards in a list based on mode
router.put('/sort',
  validate([body('listID').isMongoId(), body('boardID').isMongoId(), body('mode').notEmpty()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, mode } = req.body;
      const list = await List.findOne({ boardID, _id: listID, isArchived: false });
      if (!list) { throw 'List not found'; }

      switch (mode) {
        case 'AtoZ': {
          list.cards = list.cards.sort((a,b) => a.title.localeCompare(b.title)); break;
        }
        case 'ZtoA': {
          list.cards = list.cards.sort((a,b) => b.title.localeCompare(a.title)); break;
        }
        case 'due': {
          list.cards = list.cards.sort((a,b) => {
            if (!a.dueDate && !b.dueDate) { return 0; }
            if (!a.dueDate && b.dueDate) { return 1; }
            if (a.dueDate && !b.dueDate) { return -1; }
            return new Date(a.dueDate.dueDate) - new Date(b.dueDate.dueDate);
          });
          break;
        }
        case 'newest': {
          list.cards = list.cards.sort((a,b) => (
            new Date(parseInt(b._id.toString().slice(0,8), 16)*1000) - new Date(parseInt(a._id.toString().slice(0,8), 16)*1000)
          ));
          break;
        }
        case 'oldest': {
          list.cards = list.cards.sort((a,b) => (
            new Date(parseInt(a._id.toString().slice(0,8), 16)*1000) - new Date(parseInt(b._id.toString().slice(0,8), 16)*1000)
          ));
          break;
        }
        default: throw 'Invalid mode value';
      }

      await list.save();
      res.status(200).json({ cards: list.cards });
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
