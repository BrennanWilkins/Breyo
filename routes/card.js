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

router.put('/dueDate/add', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
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

module.exports = router;
