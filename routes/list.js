const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const { addActivity, addActivities } = require('./activity');
const Activity = require('../models/activity');

// authorization: member
// create a new list
router.post('/', auth, validate([
  body('boardID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, title } = req.body;
      const board = await Board.exists({ _id: boardID });
      if (!board) { throw 'New lists board not found'; }

      const listsLength = await List.countDocuments({ boardID, isArchived: false });
      const list = new List({ boardID, title, cards: [], archivedCards: [], indexInBoard: listsLength, isArchived: false });
      const listID = list._id;

      const actionData = { msg: null, boardMsg: `added list ${title} to this board`, cardID: null, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ listID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// update list title
router.put('/title', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, title } = req.body;
      const list = await List.findByIdAndUpdate(listID, { title }).select('title').lean();
      if (!list) { throw 'List data not found'; }
      const oldTitle = list.title;

      const actionData = { msg: null, boardMsg: `renamed list ${oldTitle} to ${title}`, cardID: null, listID, boardID };
      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// move list to different index in board
router.put('/moveList', auth, validate([
  body('sourceIndex').isInt(),
  body('destIndex').isInt(),
  body('boardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { sourceIndex, destIndex, boardID } = req.body;
      const lists = await List.find({ boardID, isArchived: false }).sort({ indexInBoard: 'asc' });
      if (!lists) { throw 'List data not found'; }
      const list = lists.splice(sourceIndex, 1)[0];
      if (!list) { throw 'Invalid list sourceIndex'; }
      lists.splice(destIndex, 0, list);

      // update all lists in board to match new order
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) {
          lists[i].indexInBoard = i;
        }
      }
      await Promise.all(lists.map(list => list.save()));

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// create a copy of a list
router.post('/copy', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
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
        roadmapLabel: card.roadmapLabel,
        dueDate: card.dueDate,
        isArchived: false,
        members: card.members,
        comments: []
      }));
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false });
      const newList = new List({ boardID: req.body.boardID, title: req.body.title, desc: list.desc, indexInBoard: lists.length, cards, archivedCards: [], isArchived: false });
      const updatedList = await newList.save();

      const activities = [];
      const actionData = { msg: null, boardMsg: `added list ${newList.title} to this board`, cardID: null, listID: updatedList._id, boardID: req.body.boardID };
      const newActivity = await addActivity(actionData, req);
      activities.push(newActivity);
      for (let card of list.cards) {
        const actionData = { msg: `copied this card from ${card.title} in list ${list.title}`, boardMsg: `copied **(link)${card.title}** from ${card.title} in list ${list.title}`,
          cardID: card._id, listID: list._id, boardID: req.body.boardID };
        const newActivity = await addActivity(actionData, req);
        activities.push(newActivity);
      }

      res.status(200).json({ newList: updatedList, activities });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// send list to archive
router.post('/archive', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, listID } = req.body;
      const lists = await List.find({ boardID, isArchived: false }).sort({ indexInBoard: 'asc' });
      if (!lists || lists.length === 0) { throw 'List data not found'; }
      const listIndex = lists.findIndex(list => String(list._id) === listID);
      if (listIndex === -1) { throw 'List not found in board lists'; }

      const archivedList = lists.splice(listIndex, 1)[0];
      // set archived list's index to end of list & set as isArchived
      archivedList.indexInBoard = lists.length;
      archivedList.isArchived = true;

      // update all lists index in board to reflect missing list
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) {
          lists[i].indexInBoard = i;
        }
      }

      const actionData = { msg: null, boardMsg: `archived list ${archivedList.title}`, cardID: null, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), archivedList.save(), ...lists.map(list => list.save())]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// send list to board from archive
router.put('/archive/recover', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID } = req.body;
      const listsLength = await List.countDocuments({ boardID, isArchived: false });
      if (!listsLength) { throw 'Lists data not found'; }
      const list = await List.findByIdAndUpdate(listID, { indexInBoard: listsLength, isArchived: false }).select('title').lean();
      if (!list) { throw 'List not found'; }

      const actionData = { msg: null, boardMsg: `recovered list ${list.title}`, cardID: null, listID, boardID };
      const newActivity = await addActivity(actionData, req);

      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// Permanently delete a list
router.delete('/archive/:listID/:boardID', auth, validate([
  param('boardID').isMongoId(),
  param('listID').isMongoId()]), useIsAdmin,
  async (req, res) => {
    try {
      const { boardID, listID } = req.params;
      const list = await List.findByIdAndDelete(listID).select('title');
      if (!list) { throw 'List not found'; }

      const actionData = { msg: null, boardMsg: `deleted list ${list.title}`, cardID: null, listID: null, boardID };
      const newActivity = await addActivity(actionData, req);

      // delete all of lists activities & return new recent activities
      await Activity.deleteMany({ listID });
      const activity = await Activity.find({ boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }

      res.status(200).json({ activity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// Send all cards in list to archive
router.put('/archive/allCards', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID } = req.body;
      const list = await List.findById(listID);
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
      const activities = await addActivities(actionData, boardID);

      list.archivedCards = list.archivedCards.concat(list.cards);
      list.cards = [];
      await list.save();
      res.status(200).json({ activities });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: member
// move all cards in a list to another list
router.put('/moveAllCards', auth, validate([
  body('boardID').isMongoId(),
  body('oldListID').isMongoId(),
  body('newListID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { oldListID, newListID } = req.body;
      const [oldList, newList] = await Promise.all([List.findById(oldListID), List.findById(newListID)]);
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

module.exports = router;
