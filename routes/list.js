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

router.post('/', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 70 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const board = await Board.findById(req.body.boardID);
      if (!board) { throw 'err'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const lists = await List.find({ boardID: req.body.boardID });
      const list = new List({ boardID: board._id, title, cards: [], indexInBoard: lists.length });
      const newList = await list.save();
      await addActivity(null, `added list ${title} to this board`, null, newList._id, req.body.boardID, req.userID);
      res.status(200).json({ listID: newList._id });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/title', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 70 }).escape(),
  body('listID').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const oldTitle = list.title;
      list.title = req.body.title.replace(/\n/g, ' ');
      await list.save();
      await addActivity(null, `renamed list ${oldTitle} to ${list.title}`, null, list._id, req.body.boardID, req.userID);
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.put('/moveList', auth, validate([body('sourceIndex').isInt(), body('destIndex').isInt(), body('boardID').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).sort({ indexInBoard: 'asc' }).lean();
      const list = lists.splice(req.body.sourceIndex, 1)[0];
      lists.splice(req.body.destIndex, 0, list);
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

router.post('/copy', auth, validate([body('*').not().isEmpty().escape(), body('title').trim().isLength({ min: 1, max: 70 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const cards = list.cards.filter(card => !card.isArchived).map(card => ({
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
        members: card.members
      }));
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).sort({ indexInBoard: 'asc' }).lean();
      const newList = new List({ boardID: req.body.boardID, title: req.body.title, desc: list.desc, indexInBoard: lists.length, cards, isArchived: false });
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
router.post('/archive', auth, validate([body('*').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).sort({ indexInBoard: 'asc' }).lean();
      if (!lists || lists.length === 0) { throw 'err'; }
      const listIndex = lists.findIndex(list => String(list._id) === req.body.listID);
      if (listIndex === -1) { throw 'err'; }
      lists.splice(listIndex, 1);
      for (let i = 0; i < lists.length; i++) {
        if (lists[i].indexInBoard !== i) { lists[i].indexInBoard = i; }
      }
      for (let list of lists) {
        await List.findByIdAndUpdate(list._id, { indexInBoard: list.indexInBoard });
      }
      const updatedList = await List.findByIdAndUpdate(req.body.listID, { indexInBoard: lists.length, isArchived: true });
      await addActivity(null, `archived list ${updatedList.title}`, null, updatedList._id, req.body.boardID, req.userID);
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/archive/recover', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const lists = await List.find({ boardID: req.body.boardID, isArchived: false }).lean();
      if (!lists.length) { throw 'err'; }
      const list = await List.findByIdAndUpdate(req.body.listID, { indexInBoard: lists.length, isArchived: false });
      await addActivity(null, `recovered list ${list.title}`, null, list._id, req.body.boardID, req.userID);
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/archive/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const list = await List.findByIdAndDelete(req.body.listID);
      await addActivity(null, `deleted list ${list.title}`, null, null, req.body.boardID, req.userID);
      await Activity.deleteMany({ listID: list._id });
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.put('/archive/allCards', auth, validate([body('*').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      list.cards.forEach(async card => {
        card.isArchived = true;
        await addActivity(`archived this card`, `archived **(link)${card.title}**`, card._id, list._id, req.body.boardID, req.userID);
      });
      await list.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

router.put('/moveAllCards', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const oldList = await List.findById(req.body.oldListID);
      const newList = await List.findById(req.body.newListID);
      if (!oldList || !newList) { throw 'err'; }
      newList.cards = newList.cards.concat([...oldList.cards]);
      oldList.cards = [];
      await oldList.save();
      await newList.save();
      await Activity.updateMany({ listID: req.body.oldListID }, { listID: req.body.newListID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
