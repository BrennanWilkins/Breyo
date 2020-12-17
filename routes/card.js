const express = require('express');
const router = express.Router();
const List = require('../models/list');
const User = require('../models/user');
const Board = require('../models/board');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');
const { format } = require('date-fns');
const isThisYear = require('date-fns/isThisYear');

const LABEL_COLORS = ['#F60000', '#FF8C00', '#FFEE00', '#4DE94C', '#3783FF', '#4815AA'];

// authorization: member
// create a new card
router.post('/', auth, validate(
  [body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, title } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'List data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = { title, desc: '', checklists: [], labels: [], dueDate: null, members: [], comments: [], roadmapLabel: null };
      list.cards.push(card);
      const cardID = list.cards[list.cards.length - 1]._id;

      const actionData = { msg: 'created this card', boardMsg: `added **(link)${title}** to ${list.title}`, cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ cardID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// update card title
router.put('/title', auth, validate(
  [body('cardID').isMongoId(),
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { cardID, listID, boardID, title } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'List data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'Card data not found'; }
      const oldTitle = card.title;
      card.title = title;

      const actionData = { msg: `renamed this card from ${oldTitle} to ${title}`, boardMsg: `renamed **(link)${title}** from ${oldTitle} to ${title}`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// update card description
router.put('/desc', auth, validate(
  [body('cardID').isMongoId(),
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('desc').isLength({ min: 0, max: 600 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.desc = req.body.desc;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add label to card
router.post('/label', auth, validate(
  [body('listID').isMongoId(),
  body('boardID').isMongoId(),
  body('cardID').isMongoId(),
  body('color').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const { color, listID, cardID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      card.labels = [...card.labels, color];
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// remove label from card
router.put('/label/remove', auth, validate([
  body('listID').isMongoId(),
  body('boardID').isMongoId(),
  body('cardID').isMongoId(),
  body('color').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const { color, cardID, listID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      const labelIndex = card.labels.indexOf(color);
      if (labelIndex === -1) { throw 'Label not found in cards labels'; }
      card.labels.splice(labelIndex, 1);
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add roadmap label to card
router.post('/roadmapLabel', auth, validate(
  [body('listID').isMongoId(),
  body('boardID').isMongoId(),
  body('cardID').isMongoId(),
  body('color').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const { color, cardID, listID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      card.roadmapLabel = color;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// remove roadmap label from card
router.delete('/roadmapLabel/:cardID/:listID/:boardID', auth, validate(
  [param('listID').isMongoId(),
  param('boardID').isMongoId(),
  param('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { listID, cardID } = req.params;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      card.roadmapLabel = null;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// toggle card due date as complete/incomplete
router.put('/dueDate/isComplete', auth, validate([
  body('listID').isMongoId(),
  body('boardID').isMongoId(),
  body('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { cardID, listID, boardID } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      if (!card.dueDate) { throw 'No due date found for card'; }
      card.dueDate = { ...card.dueDate, isComplete: !card.dueDate.isComplete};

      const completeText = card.dueDate.isComplete ? 'complete' : 'incomplete';
      const actionData = { msg: `marked the due date as ${completeText}`, boardMsg: `marked the due date on **(link)${card.title}** as ${completeText}`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add due date to card
router.post('/dueDate', auth, validate([
  body('listID').isMongoId(),
  body('boardID').isMongoId(),
  body('cardID').isMongoId(),
  body('dueDate').notEmpty(),
  body('startDate').exists()]), useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID, dueDate, startDate } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      if (isNaN(new Date(dueDate).getDate())) { throw 'Invalid due date format'; }
      if (startDate !== null && isNaN(new Date(startDate).getDate())) { throw 'Invalid start date format'; }
      card.dueDate = { dueDate, startDate, isComplete: false };

      // format date in action & show year in date if not current year
      let date = new Date(dueDate);
      date = isThisYear(date) ? format(date, `MMM d 'at' h:mm aa`) : format(date, `MMM d, yyyy 'at' h:mm aa`);

      const actionData = { msg: `set this card to be due ${date}`, boardMsg: `set **(link)${card.title}** to be due ${date}`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// remove due date from card
router.delete('/dueDate/:cardID/:listID/:boardID', auth, validate([
  param('listID').isMongoId(),
  param('boardID').isMongoId(),
  param('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID } = req.params;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      card.dueDate = null;

      const actionData = { msg: `removed the due date from this card`, boardMsg: `removed the due date from **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add checklist to card
router.post('/checklist', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, title } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      card.checklists.push({ title, items: [] });
      const checklistID = card.checklists[card.checklists.length - 1]._id;

      const actionData = { msg: `added checklist ${title} to this card`, boardMsg: `added checklist ${title} to **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ checklistID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// remove checklist from card
router.delete('/checklist/:checklistID/:cardID/:listID/:boardID', auth, validate([
  param('listID').isMongoId(),
  param('boardID').isMongoId(),
  param('cardID').isMongoId(),
  param('checklistID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID, checklistID } = req.params;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      const checklist = card.checklists.id(checklistID);
      checklist.remove();

      const actionData = { msg: `removed checklist ${checklist.title} from this card`, boardMsg: `removed checklist ${checklist.title} from **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// update checklist title
router.put('/checklist/title', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('checklistID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, checklistID, title } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      const checklist = card.checklists.id(checklistID);
      const oldTitle = checklist.title;
      checklist.title = title;

      const actionData = { msg: `renamed checklist ${oldTitle} to ${title}`, boardMsg: `renamed checklist ${oldTitle} to ${title} in **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add item to a checklist
router.post('/checklist/item', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('checklistID').isMongoId(),
  body('title').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const { listID, cardID, checklistID, title } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'No checklist data found'; }
      checklist.items.push({ title, isComplete: false });
      const itemID = checklist.items[checklist.items.length - 1]._id;

      await list.save();

      res.status(200).json({ itemID });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// toggle checklist item as complete/incomplete
router.put('/checklist/item/isComplete', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('checklistID').isMongoId(),
  body('itemID').isMongoId()
  ]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, checklistID, itemID } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'Card checklist not found'; }
      const item = checklist.items.id(itemID);
      if (!item) { throw 'Checklist item not found'; }
      item.isComplete = !item.isComplete;

      const cardMsg = item.isComplete ? `completed ${item.title} in checklist ${checklist.title}` : `marked ${item.title} incomplete in checklist ${checklist.title}`;
      const boardMsg = item.isComplete ? `completed ${item.title} in **(link)${card.title}**` : `marked ${item.title} incomplete in **(link)${card.title}**`;
      const actionData = { msg: cardMsg, boardMsg, cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// update checklist item title
router.put('/checklist/item/title', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('checklistID').isMongoId(),
  body('itemID').isMongoId(),
  body('title').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }

      const checklist = card.checklists.id(req.body.checklistID);
      if (!checklist) { throw 'Card checklist not found'; }

      const item = checklist.items.id(req.body.itemID);
      if (!item) { throw 'Checklist item not found'; }
      item.title = req.body.title;

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// delete item from checklist
router.put('/checklist/item/delete', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('checklistID').isMongoId(),
  body('itemID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.checklists.id(req.body.checklistID).items.id(req.body.itemID).remove();

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// move card inside the same list
router.put('/moveCard/sameList', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('sourceIndex').isInt(),
  body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      // remove card from original index
      const card = list.cards.splice(req.body.sourceIndex, 1)[0];
      if (!card) { throw 'Card not found in list'; }

      // add card back to new index
      list.cards.splice(req.body.destIndex, 0, card);

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// move card to a different list
router.put('/moveCard/diffList', auth, validate([
  body('boardID').isMongoId(),
  body('sourceID').isMongoId(),
  body('targetID').isMongoId(),
  body('sourceIndex').isInt(),
  body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const { sourceID, targetID, sourceIndex, destIndex } = req.body;
      const [sourceList, destList] = await Promise.all([List.findById(sourceID), List.findById(targetID)]);
      if (!sourceList || !destList) { throw 'List data not found'; }
      if (sourceList.isArchived || destList.isArchived) { throw 'Cannot move a card to an archived list.'; }

      // remove card from source list
      const card = sourceList.cards.splice(sourceIndex, 1)[0];
      if (!card) { throw 'Card not found in list'; }

      // update card's listID & add to destination list
      card.listID = targetID;
      // update listID for all of card's comments
      for (let comment of card.comments) { comment.listID = targetID; }
      destList.cards.splice(destIndex, 0, card);

      await Promise.all([
        sourceList.save(),
        destList.save(),
        Activity.updateMany({ listID: sourceID }, { listID: targetID })
      ]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// create a copy of a card
router.post('/copy', auth, validate([
  body('boardID').isMongoId(),
  body('sourceListID').isMongoId(),
  body('destListID').isMongoId(),
  body('cardID').isMongoId(),
  body('title').isLength({ min: 1, max: 200 }),
  body('destIndex').isInt(),
  body('keepLabels').isBoolean(),
  body('keepChecklists').isBoolean()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, sourceListID, destListID, cardID, title, destIndex, keepLabels, keepChecklists } = req.body;
      const [sourceList, destList] = await Promise.all([List.findById(sourceListID), List.findById(destListID)]);
      if (!sourceList || !destList) { throw 'List data not found'; }
      if (sourceList.isArchived || destList.isArchived) { throw 'Cannot copy a card a card to or from an archived list.'; }

      const sourceCard = sourceList.cards.id(cardID);
      if (!sourceCard) { throw 'Card data not found'; }

      // keep card labels in the copy if requested
      const labels = keepLabels ? sourceCard.labels : [];
      const roadmapLabel = keepLabels ? sourceCard.roadmapLabel : null;

      const checklists = [];
      // create nested copy of card checklists if requested
      if (keepChecklists) {
        for (let checklist of sourceCard.checklists) {
          const items = checklist.items.map(item => ({ title: item.title, isComplete: item.isComplete }));
          checklists.push({ title: checklist.title, items });
        }
      }

      const newCard = { title, labels, roadmapLabel, checklists, desc: '', dueDate: null, members: [], comments: [] };
      // add copied card to destination list
      destList.cards.splice(destIndex, 0, newCard);
      const updatedCard = destList.cards[destIndex];

      const actionData = { msg: `copied this card to list ${destList.title}`, boardMsg: `copied **(link)${title}** to list ${destList.title}`,
        cardID: updatedCard._id, listID: destListID, boardID };

      const results = await Promise.all([addActivity(actionData, req), destList.save()]);
      const newActivity = results[0];

      res.status(200).json({ cardID: updatedCard._id, checklists: updatedCard.checklists, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// send a card to archive
router.post('/archive', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'No card data found'; }
      list.archivedCards.unshift(card);
      card.remove();

      const actionData = { msg: `archived this card`, boardMsg: `archived **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// send card back to list from archive
router.put('/archive/recover', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }

      const card = list.archivedCards.id(cardID);
      if (!card) { throw 'No card data found'; }
      list.cards.push(card);
      card.remove();

      const actionData = { msg: `recovered this card`, boardMsg: `recovered **(link)${card.title}**`, cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// permanently delete a card
router.delete('/archive/:cardID/:listID/:boardID', auth, validate([
  param('boardID').isMongoId(),
  param('listID').isMongoId(),
  param('cardID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.params;
      const list = await List.findById(listID);
      if (!list) { throw 'No list data found'; }

      const card = list.archivedCards.id(cardID);
      if (!card) { throw 'Card data not found'; }
      card.remove();

      const newActivity = new Activity({ msg: null, boardMsg: `deleted ${card.title} from list ${list.title}`,
        email: req.email, fullName: req.fullName, cardID: null, listID: null, boardID, date: new Date() })

      await Promise.all([newActivity.save(), list.save(), Activity.deleteMany({ cardID })]);

      // fetch new recent 20 activities after deleting all of card's activity
      const activity = await Activity.find({ boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }

      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add card member
router.post('/members', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('email').isEmail()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, email } = req.body;
      const [list, user] = await Promise.all([List.findById(listID), User.findOne({ email }).select('fullName boards').lean()]);
      if (!list || !user) { throw 'Data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      if (!user.boards.map(String).includes(boardID)) { throw 'User must be member of board'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'Card data not found'; }

      // if user already member of the card
      if (card.members.find(member => member.email === email)) { throw 'User already a member of the card'; }

      card.members.push({ email, fullName: user.fullName });

      const actionData = { msg: `added ${user.fullName} to this card`, boardMsg: `added ${user.fullName} to **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// remove a card member
router.delete('/members/:email/:cardID/:listID/:boardID', auth, validate([
  param('boardID').isMongoId(),
  param('listID').isMongoId(),
  param('cardID').isMongoId(),
  param('email').isEmail()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, email } = req.params;
      const [list, user] = await Promise.all([List.findById(listID), User.findOne({ email }).select('fullName').lean()]);
      if (!list || !user) { throw 'Data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'Card data not found'; }

      card.members = card.members.filter(member => member.email !== email);

      const actionData = { msg: `removed ${user.fullName} from this card`, boardMsg: `removed ${user.fullName} from **(link)${card.title}**`,
        cardID, listID, boardID };

      const results = await Promise.all([addActivity(actionData, req), list.save()]);
      const newActivity = results[0];

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member
// add comment to card
router.post('/comments', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('msg').isLength({ min: 1, max: 400 }),
  body('date').not().isEmpty()]), useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, msg, date } = req.body;
      const list = await List.findById(listID);
      if (!list) { throw 'List data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const card = list.cards.id(cardID);
      if (!card) { throw 'Card data not found'; }
      card.comments.push({ email: req.email, fullName: req.fullName, date, msg, cardID, listID });
      const commentID = card.comments[card.comments.length - 1]._id;
      await list.save();

      res.status(200).json({ commentID, cardTitle: card.title });
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member, creator
// edit comment msg, must be original author to edit
router.put('/comments', auth, validate([
  body('boardID').isMongoId(),
  body('listID').isMongoId(),
  body('cardID').isMongoId(),
  body('commentID').isMongoId(),
  body('msg').isLength({ min: 1, max: 400 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const comment = list.cards.id(req.body.cardID).comments.id(req.body.commentID);
      if (!comment) { throw 'Comment not found'; }
      if (req.email !== comment.email) { throw 'User must be original author to edit'; }
      comment.msg = req.body.msg;

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// authorization: member, creator
// delete a comment, must be original author
router.delete('/comments/:commentID/:cardID/:listID/:boardID', auth, validate([
  param('boardID').isMongoId(),
  param('listID').isMongoId(),
  param('cardID').isMongoId(),
  param('commentID').isMongoId()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.params.listID);
      if (!list) { throw 'List data found'; }
      if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }

      const comment = list.cards.id(req.params.cardID).comments.id(req.params.commentID);
      if (!comment) { throw 'Comment not found'; }
      if (req.email !== comment.email) { throw 'Must be original author to delete comment'; }
      comment.remove();

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
