const express = require('express');
const router = express.Router();
const List = require('../models/list');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');

const LABEL_COLORS = ['#F60000', '#FF8C00', '#FFEE00', '#4DE94C', '#3783FF', '#4815AA'];

router.post('/', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 100 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const card = { title, desc: '', checklists: [], labels: [], dueDate: null };
      list.cards.push(card);
      const updatedList = await list.save();
      const cardID = updatedList.cards[updatedList.cards.length - 1]._id;
      res.status(200).json({ cardID });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/title', auth, validate(
  [body('cardID').not().isEmpty().escape(),
  body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 100 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.title = title;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/desc', auth, validate(
  [body('cardID').not().isEmpty().escape(),
  body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('desc').isLength({ max: 300 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.desc = req.body.desc;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/label/add', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      if (!LABEL_COLORS.includes(req.body.color)) { throw 'err'; }
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.labels = [...card.labels, req.body.color];
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/label/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      if (!LABEL_COLORS.includes(req.body.color)) { throw 'err'; }
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.labels.splice(card.labels.indexOf(req.body.color), 1);
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/dueDate/isComplete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card || !card.dueDate) { throw 'err'; }
      card.dueDate.isComplete = !card.dueDate.isComplete;
      list.markModified('cards');
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/dueDate', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      if (isNaN(new Date(req.body.dueDate).getDate())) { throw 'err'; }
      card.dueDate = { dueDate: req.body.dueDate, isComplete: false };
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/dueDate/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.dueDate = null;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/checklist', auth, validate(
  [body('*').not().isEmpty().escape()],
  [body('title').isLength({ min: 1, max: 100 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      const title = req.body.title.replace(/\n/g, ' ');
      card.checklists.push({ title, items: [] });
      const updatedList = await list.save();
      const checklists = updatedList.cards.id(req.body.cardID).checklists;
      const checklistID = checklists[checklists.length - 1]._id;
      res.status(200).json({ checklistID });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/checklist/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.checklists.id(req.body.checklistID).remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/checklist/item', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      const checklist = card.checklists.id(req.body.checklistID);
      const title = req.body.title.replace(/\n/g, ' ');
      checklist.items.push({ title, isComplete: false });
      const updatedList = await list.save();
      const updatedChecklist = updatedList.cards.id(req.body.cardID).checklists.id(req.body.checklistID);
      const itemID = checklist.items[checklist.items.length - 1]._id;
      res.status(200).json({ itemID });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/checklist/item/isComplete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      const item = card.checklists.id(req.body.checklistID).items.id(req.body.itemID);
      item.isComplete = !item.isComplete;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/checklist/item/title', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const item = card.checklists.id(req.body.checklistID).items.id(req.body.itemID);
      item.title = title;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/checklist/item/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.checklists.id(req.body.checklistID).items.id(req.body.itemID).remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { console.log(err); res.sendStatus(500); }
  }
);

module.exports = router;
