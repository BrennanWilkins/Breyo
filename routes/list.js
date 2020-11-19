const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');

// create a new list
router.post('/', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 70 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'Board data not found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false });
      const list = new List({ boardID: board._id, title, cards: [], archivedCards: [], indexInBoard: lists.length, isArchived: false });
      const newList = await list.save();
      const newActivity = await addActivity(null, `added list ${title} to this board`, null, newList._id, req.body.boardID, req.userID);
      res.status(200).json({ listID: newList._id, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update list title
router.put('/title', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 70 }).escape(),
  body('listID').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
      const oldTitle = list.title;
      list.title = req.body.title.replace(/\n/g, ' ');
      await list.save();
      const newActivity = await addActivity(null, `renamed list ${oldTitle} to ${list.title}`, null, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// move list to different index in board
router.put('/moveList', auth, validate([body('sourceIndex').isInt(), body('destIndex').isInt(), body('boardID').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).sort({ indexInBoard: 'asc' }).lean();
      const list = lists.splice(req.body.sourceIndex, 1)[0];
      if (!list) { throw 'List not found'; }
      lists.splice(req.body.destIndex, 0, list);
      // update all lists in board to match new order
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) { lists[i].indexInBoard = i; }
      }
      for (let list of lists) {
        await List.findByIdAndUpdate(list._id, { indexInBoard: list.indexInBoard });
      }
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// create a copy of a list
router.post('/copy', auth, validate([body('*').not().isEmpty().escape(), body('title').trim().isLength({ min: 1, max: 70 })]), useIsMember,
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
        dueDate: card.dueDate,
        isArchived: false,
        members: card.members,
        comments: []
      }));
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false });
      const newList = new List({ boardID: req.body.boardID, title: req.body.title, desc: list.desc, indexInBoard: lists.length, cards, archivedCards: [], isArchived: false });
      const updatedList = await newList.save();
      await addActivity(null, `added list ${newList.title} to this board`, null, updatedList._id, req.body.boardID, req.userID);
      for (let card of list.cards) {
        await addActivity(`copied this card from ${card.title} in list ${list.title}`, `copied **(link)${card.title}** from ${card.title} in list ${list.title}`,
          card._id, list._id, req.body.boardID, req.userID);
      }
      res.status(200).json({ newList: updatedList });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: admin
// send list to archive
router.post('/archive', auth, validate([body('*').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).sort({ indexInBoard: 'asc' }).lean();
      if (!lists || lists.length === 0) { throw 'List data not found'; }
      const listIndex = lists.findIndex(list => String(list._id) === req.body.listID);
      if (listIndex === -1) { throw 'List not found in board lists'; }
      lists.splice(listIndex, 1);
      // update all lists index in board to reflect missing list
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) { lists[i].indexInBoard = i; }
      }
      for (let list of lists) {
        await List.findByIdAndUpdate(list._id, { indexInBoard: list.indexInBoard });
      }
      // set archived list's index to end of list & set as isArchived
      const updatedList = await List.findByIdAndUpdate(req.body.listID, { indexInBoard: lists.length, isArchived: true });
      const newActivity = await addActivity(null, `archived list ${updatedList.title}`, null, updatedList._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// send list to board from archive
router.put('/archive/recover', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).lean();
      if (!lists.length) { throw 'Lists data not found'; }
      const list = await List.findByIdAndUpdate(req.body.listID, { indexInBoard: lists.length, isArchived: false });
      const newActivity = await addActivity(null, `recovered list ${list.title}`, null, list._id, req.body.boardID, req.userID);
      res.status(200).json({ archivedCards: list.archivedCards, newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
// Permanently delete a list
router.put('/archive/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const list = await List.findByIdAndDelete(req.body.listID);
      const newActivity = await addActivity(null, `deleted list ${list.title}`, null, null, req.body.boardID, req.userID);
      await Activity.deleteMany({ listID: list._id });
      res.status(200).json({ newActivity });
    } catch(err) { res.sendStatus(500); }
  }
);

// Send all cards in list to archive
router.put('/archive/allCards', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
      // set all cards to isArchived & add action for each card
      list.cards.forEach(async card => {
        await addActivity(`archived this card`, `archived **(link)${card.title}**`, card._id, list._id, req.body.boardID, req.userID);
      });
      list.archivedCards = list.archivedCards.concat(list.cards);
      list.cards = [];
      await list.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// move all cards in a list to another list
router.put('/moveAllCards', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const oldList = await List.findById(req.body.oldListID);
      const newList = await List.findById(req.body.newListID);
      if (!oldList || !newList) { throw 'Old list or new list data not found'; }
      newList.cards = newList.cards.concat(oldList.cards);
      newList.archivedCards = newList.archivedCards.concat(oldList.archivedCards);
      oldList.cards = [];
      oldList.archivedCards = [];
      await oldList.save();
      await newList.save();
      await Activity.updateMany({ listID: req.body.oldListID }, { listID: req.body.newListID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
