const express = require('express');
const router = express.Router();
const List = require('../models/list');
const User = require('../models/user');
const Board = require('../models/board');
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
      const card = { title, desc: '', checklists: [], labels: [], dueDate: null, isArchived: false, members: [], comments: [] };
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (!card) { throw 'err'; }
      if (card.isArchived || !card.dueDate) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
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
      if (card.isArchived) { throw 'err'; }
      card.checklists.id(req.body.checklistID).items.id(req.body.itemID).remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/moveCard/sameList', auth, validate([body('*').not().isEmpty().escape(), body('sourceIndex').isInt(), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const card = list.cards.splice(req.body.sourceIndex, 1)[0];
      if (card.isArchived) { throw 'err'; }
      list.cards.splice(req.body.destIndex, 0, card);
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/moveCard/diffList', auth, validate([body('*').not().isEmpty().escape(), body('sourceIndex').isInt(), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const sourceList = await List.findById(req.body.sourceID);
      const destList = await List.findById(req.body.targetID);
      const card = sourceList.cards.splice(req.body.sourceIndex, 1)[0];
      if (card.isArchived) { throw 'err'; }
      card.listID = req.body.targetID;
      destList.cards.splice(req.body.destIndex, 0, card);
      await sourceList.save();
      await destList.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/copy', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 100 }), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const sourceList = await List.findById(req.body.sourceListID);
      const destList = await List.findById(req.body.destListID);
      const title = req.body.title.replace(/\n/g, ' ');
      const sourceCard = sourceList.cards.id(req.body.cardID);
      if (sourceCard.isArchived) { throw 'err'; }
      const labels = req.body.keepLabels === 'true' ? sourceCard.labels : [];
      const checklists = [];
      if (req.body.keepChecklists === 'true') {
        for (let checklist of sourceCard.checklists) {
          const items = checklist.items.map(item => ({ title: item.title, isComplete: item.isComplete }));
          checklists.push({ title: checklist.title, items });
        }
      }
      const newCard = { title, labels, checklists, desc: '', dueDate: null, isArchived: false, members: [], comments: [] };
      destList.cards.splice(req.body.destIndex, 0, newCard);
      const updatedList = await destList.save();
      const updatedCard = updatedList.cards[req.body.destIndex];
      res.status(200).json({ cardID: updatedCard._id, checklists: updatedCard.checklists });
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/archive', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const card = list.cards.id(req.body.cardID);
      if (!card || card.isArchived) { throw 'err'; }
      card.isArchived = true;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/archive/recover', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'err'; }
      card.isArchived = false;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/archive/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const card = list.cards.id(req.body.cardID).remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/members', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findOne({ email: req.body.email });
      const board = await Board.findById(req.body.boardID);
      if (!list || !user || !board) { throw 'err'; }
      // if user not member of the board
      if (!board.members.find(member => member.email === user.email)) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      // if user already member of the card
      if (card.members.find(member => member.email === user.email)) { throw 'err'; }
      card.members.push({ email: user.email, fullName: user.fullName });
      await list.save();
      res.sendStatus(200);
    } catch (err) { console.log(err); res.sendStatus(500); }
  }
);

router.put('/members/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findOne({ email: req.body.email });
      const board = await Board.findById(req.body.boardID);
      if (!list || !user || !board) { throw 'err'; }
      // if user not member of the board
      if (!board.members.find(member => member.email === user.email)) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      card.members = card.members.filter(member => member.email !== user.email);
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.post('/comments', auth, validate([body('*').not().isEmpty().escape(), body('msg').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'err'; }
      const card = list.cards.id(req.body.cardID);
      card.comments.push({ email: user.email, fullName: user.fullName, date: req.body.date, msg: req.body.msg, cardID: req.body.cardID, listID: req.body.listID });
      const updatedList = await list.save();
      const updatedComments = updatedList.cards.id(req.body.cardID).comments;
      const commentID = updatedComments[updatedComments.length - 1]._id;
      res.status(200).json({ commentID });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/comments', auth, validate([body('*').not().isEmpty().escape(), body('msg').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'err'; }
      const comment = list.cards.id(req.body.cardID).comments.id(req.body.commentID);
      if (user.email !== comment.email) { throw 'err'; }
      comment.msg = req.body.msg;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/comments/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'err'; }
      const comment = list.cards.id(req.body.cardID).comments.id(req.body.commentID);
      if (user.email !== comment.email) { throw 'err'; }
      comment.remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
