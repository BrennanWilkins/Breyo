const express = require('express');
const router = express.Router();
const List = require('../models/list');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');

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
      card.title = title;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
