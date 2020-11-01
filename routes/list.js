const express = require('express');
const router = express.Router();
const Board = require('../models/board');
const List = require('../models/list');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const useIsAdmin = require('../middleware/useIsAdmin');

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
      res.status(200).json({ listID: newList._id });
    } catch (err) { res.sendStatus(500); }
  }
);

router.put('/position', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('position').isInt(),
  body('listID').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'err'; }
      const lists = await List.find({ boardID: req.body.boardID });
      if (req.body.position < 0 || req.body.position > lists.length) { throw 'err'; }
      list.indexInBoard = req.body.position;
      // TO DO
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
      list.title = req.body.title.replace(/\n/g, ' ');
      await list.save();
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

// authorization: admin
router.delete('/', auth, validate(
  [param('boardID').not().isEmpty().escape(),
  param('listID').not().isEmpty().escape()]), useIsAdmin,
  async (req, res) => {
    try {
      await List.findByIdAndDelete(req.body.listID);
      res.sendStatus(200);
    } catch(err) { res.sendStatus(500); }
  }
);

module.exports = router;
