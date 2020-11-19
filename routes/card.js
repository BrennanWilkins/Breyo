const express = require('express');
const router = express.Router();
const List = require('../models/list');
const User = require('../models/user');
const Board = require('../models/board');
const { body } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');
const { format } = require('date-fns');
const isThisYear = require('date-fns/isThisYear');

const LABEL_COLORS = ['#F60000', '#FF8C00', '#FFEE00', '#4DE94C', '#3783FF', '#4815AA'];

// create a new card
router.post('/', auth, validate(
  [body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 100 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const card = { title, desc: '', checklists: [], labels: [], dueDate: null, members: [], comments: [] };
      list.cards.push(card);
      const updatedList = await list.save();
      const cardID = updatedList.cards[updatedList.cards.length - 1]._id;
      const newActivity = await addActivity(`created this card`, `added **(link)${card.title}** to ${list.title}`, cardID, list._id, req.body.boardID, req.userID);
      res.status(200).json({ cardID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update card title
router.put('/title', auth, validate(
  [body('cardID').not().isEmpty().escape(),
  body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('title').isLength({ min: 1, max: 100 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'List data not found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'Card data not found'; }
      const oldTitle = card.title;
      card.title = title;
      await list.save();
      const newActivity = await addActivity(`renamed this card from ${oldTitle} to ${title}`, `renamed **(link)${title}** from ${oldTitle} to ${title}`,
      card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update card description
router.put('/desc', auth, validate(
  [body('cardID').not().isEmpty().escape(),
  body('boardID').not().isEmpty().escape(),
  body('listID').not().isEmpty().escape(),
  body('desc').isLength({ max: 300 }).escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.desc = req.body.desc;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add label to card
router.put('/label/add', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      if (!LABEL_COLORS.includes(req.body.color)) { throw 'Invalid label color'; }
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.labels = [...card.labels, req.body.color];
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// remove label from card
router.put('/label/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      if (!LABEL_COLORS.includes(req.body.color)) { throw 'Invalid label color'; }
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const labelIndex = card.labels.indexOf(req.body.color);
      if (labelIndex === -1) { throw 'Label not found in cards labels'; }
      card.labels.splice(labelIndex, 1);
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// toggle card due date as complete/incomplete
router.put('/dueDate/isComplete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      if (!card.dueDate) { throw 'No due date found for card'; }
      card.dueDate.isComplete = !card.dueDate.isComplete;
      list.markModified('cards');
      await list.save();
      const completeText = card.dueDate.isComplete ? 'complete' : 'incomplete';
      const newActivity = await addActivity(`marked the due date as ${completeText}`, `marked the due date on **(link)${card.title}** as ${completeText}`,
         card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add due date to card
router.post('/dueDate', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      if (isNaN(new Date(req.body.dueDate).getDate())) { throw 'Invalid due date format'; }
      card.dueDate = { dueDate: req.body.dueDate, isComplete: false };
      await list.save();

      // format date in action & show year in date if not current year
      const date = isThisYear(new Date(req.body.dueDate)) ?
      format(new Date(req.body.dueDate), `MMM d 'at' h:mm aa`) :
      format(new Date(req.body.dueDate), `MMM d, yyyy 'at' h:mm aa`);

      const newActivity = await addActivity(`set this card to be due ${date}`, `set **(link)${card.title}** to be due ${date}`,
        card._id, list._id, req.body.boardID, req.userID);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// remove due date from card
router.put('/dueDate/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.dueDate = null;
      await list.save();
      const newActivity = await addActivity(`removed the due date from this card`, `removed the due date from **(link)${card.title}**`,
        card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add checklist to card
router.post('/checklist', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 100 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      card.checklists.push({ title, items: [] });
      const updatedList = await list.save();
      const checklists = updatedList.cards.id(req.body.cardID).checklists;
      const checklistID = checklists[checklists.length - 1]._id;
      const newActivity = await addActivity(`added checklist ${title} to this card`, `added checklist ${title} to **(link)${card.title}**`,
        card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ checklistID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// remove checklist from card
router.put('/checklist/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const checklist = card.checklists.id(req.body.checklistID);
      checklist.remove();
      await list.save();
      const newActivity = await addActivity(`removed checklist ${checklist.title} from this card`, `removed checklist ${checklist.title} from **(link)${card.title}**`,
        card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update checklist title
router.put('/checklist/title', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 100 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const checklist = card.checklists.id(req.body.checklistID);
      const oldTitle = checklist.title;
      checklist.title = title;
      await list.save();
      const newActivity = await addActivity(`renamed checklist ${oldTitle} to ${title}`, `renamed checklist ${oldTitle} to ${title} in **(link)${card.title}**`,
        card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add item to a checklist
router.post('/checklist/item', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const checklist = card.checklists.id(req.body.checklistID);
      if (!checklist) { throw 'No checklist data found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      checklist.items.push({ title, isComplete: false });
      const updatedList = await list.save();
      const updatedChecklist = updatedList.cards.id(req.body.cardID).checklists.id(req.body.checklistID);
      const itemID = checklist.items[checklist.items.length - 1]._id;
      res.status(200).json({ itemID });
    } catch (err) { res.sendStatus(500); }
  }
);

// toggle checklist item as complete/incomplete
router.put('/checklist/item/isComplete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const checklist = card.checklists.id(req.body.checklistID);
      if (!checklist) { throw 'Card checklist not found'; }
      const item = checklist.items.id(req.body.itemID);
      if (!item) { throw 'Checklist item not found'; }
      item.isComplete = !item.isComplete;
      await list.save();
      const newActivity = await addActivity(`completed ${item.title} in checklist ${checklist.title}`, `completed ${item.title} in **(link)${card.title}**`,
        card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update checklist item title
router.put('/checklist/item/title', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 200 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const checklist = card.checklists.id(req.body.checklistID);
      if (!checklist) { throw 'Card checklist not found'; }
      const item = checklist.items.id(req.body.itemID);
      if (!item) { throw 'Checklist item not found'; }
      item.title = title;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// delete item from checklist
router.put('/checklist/item/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      card.checklists.id(req.body.checklistID).items.id(req.body.itemID).remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// move card inside the same list
router.put('/moveCard/sameList', auth, validate([body('*').not().isEmpty().escape(), body('sourceIndex').isInt(), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
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

// move card to a different list
router.put('/moveCard/diffList', auth, validate([body('*').not().isEmpty().escape(), body('sourceIndex').isInt(), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const sourceList = await List.findById(req.body.sourceID);
      const destList = await List.findById(req.body.targetID);
      if (!sourceList || !destList) { throw 'List data not found'; }
      // remove card from source list
      const card = sourceList.cards.splice(req.body.sourceIndex, 1)[0];
      if (!card) { throw 'Card not found in list'; }
      // update card's listID & add to destination list
      card.listID = req.body.targetID;
      destList.cards.splice(req.body.destIndex, 0, card);
      await sourceList.save();
      await destList.save();
      await Activity.updateMany({ listID: req.body.sourceID }, { listID: req.body.targetID });
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// create a copy of a card
router.post('/copy', auth, validate([body('*').not().isEmpty().escape(), body('title').isLength({ min: 1, max: 100 }), body('destIndex').isInt()]), useIsMember,
  async (req, res) => {
    try {
      const sourceList = await List.findById(req.body.sourceListID);
      const destList = await List.findById(req.body.destListID);
      if (!sourceList || !destList) { throw 'List data not found'; }
      const title = req.body.title.replace(/\n/g, ' ');
      const sourceCard = sourceList.cards.id(req.body.cardID);
      if (!sourceCard) { throw 'Card data not found'; }
      // keep card labels in the copy if requested
      const labels = req.body.keepLabels === 'true' ? sourceCard.labels : [];
      const checklists = [];
      // create nested copy of card checklists if requested
      if (req.body.keepChecklists === 'true') {
        for (let checklist of sourceCard.checklists) {
          const items = checklist.items.map(item => ({ title: item.title, isComplete: item.isComplete }));
          checklists.push({ title: checklist.title, items });
        }
      }
      const newCard = { title, labels, checklists, desc: '', dueDate: null, members: [], comments: [] };
      // add copied card to destination list
      destList.cards.splice(req.body.destIndex, 0, newCard);
      const updatedList = await destList.save();
      const updatedCard = updatedList.cards[req.body.destIndex];
      const newActivity = await addActivity(`copied this card to list ${destList.title}`, `copied **(link)${title}** to list ${destList.title}`,
        updatedCard._id, destList._id, req.body.boardID, req.userID);
      res.status(200).json({ cardID: updatedCard._id, checklists: updatedCard.checklists, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// send a card to archive
router.post('/archive', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      const checkIfArchived = list.archivedCards.id(req.body.cardID);
      if (checkIfArchived) { throw 'Card already archived'; }
      list.archivedCards.unshift(card);
      card.remove();
      await list.save();
      const newActivity = await addActivity(`archived this card`, `archived **(link)${card.title}**`, card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// send card back to list from archive
router.put('/archive/recover', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      if (list.isArchived) { throw 'Cannot recover a card to an archived list'; }
      const card = list.archivedCards.id(req.body.cardID);
      if (!card) { throw 'No card data found'; }
      list.cards.push(card);
      card.remove();
      await list.save();
      const newActivity = await addActivity(`recovered this card`, `recovered **(link)${card.title}**`, card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// permanently delete a card
router.put('/archive/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      if (!list) { throw 'No list data found'; }
      const card = list.archivedCards.id(req.body.cardID);
      if (!card) { throw 'Card data not found'; }
      card.remove();
      await list.save();
      const newActivity = await addActivity(null, `deleted ${card.title} from list ${list.title}`, null, null, req.body.boardID, req.userID);
      await Activity.deleteMany({ cardID: card._id });
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add card member
router.post('/members', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findOne({ email: req.body.email });
      const board = await Board.findById(req.body.boardID);
      if (!list || !user || !board) { throw 'Data not found'; }
      if (!board.members.find(member => member.email === user.email)) { throw 'User must be member of board'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'Card data not found'; }
      // if user already member of the card
      if (card.members.find(member => member.email === user.email)) { throw 'User already a member of the card'; }
      card.members.push({ email: user.email, fullName: user.fullName });
      await list.save();
      const newActivity = await addActivity(`added ${user.fullName} to this card`, `added ${user.fullName} to **(link)${card.title}**`,
      card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { console.log(err); res.sendStatus(500); }
  }
);

// remove a card member
router.put('/members/remove', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findOne({ email: req.body.email });
      const board = await Board.findById(req.body.boardID);
      if (!list || !user || !board) { throw 'Data not found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'Card data not found'; }
      card.members = card.members.filter(member => member.email !== user.email);
      await list.save();
      const newActivity = await addActivity(`removed ${user.fullName} from this card`, `removed ${user.fullName} from **(link)${card.title}**`,
      card._id, list._id, req.body.boardID, req.userID);
      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add comment to card
router.post('/comments', auth, validate([body('*').not().isEmpty().escape(), body('msg').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'List or user data not found'; }
      const card = list.cards.id(req.body.cardID);
      if (!card) { throw 'Card data not found'; }
      card.comments.push({ email: user.email, fullName: user.fullName, date: req.body.date, msg: req.body.msg, cardID: req.body.cardID, listID: req.body.listID });
      const updatedList = await list.save();
      const updatedComments = updatedList.cards.id(req.body.cardID).comments;
      const commentID = updatedComments[updatedComments.length - 1]._id;
      res.status(200).json({ commentID });
    } catch (err) { res.sendStatus(500); }
  }
);

// edit comment msg, must be original author to edit
router.put('/comments', auth, validate([body('*').not().isEmpty().escape(), body('msg').isLength({ min: 1, max: 300 })]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'List or user data not found'; }
      const comment = list.cards.id(req.body.cardID).comments.id(req.body.commentID);
      if (!comment) { throw 'Comment not found'; }
      if (user.email !== comment.email) { throw 'User must be original author to edit'; }
      comment.msg = req.body.msg;
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// delete a comment
router.put('/comments/delete', auth, validate([body('*').not().isEmpty().escape()]), useIsMember,
  async (req, res) => {
    try {
      const list = await List.findById(req.body.listID);
      const user = await User.findById(req.userID);
      if (!list || !user) { throw 'No list or user data found'; }
      const comment = list.cards.id(req.body.cardID).comments.id(req.body.commentID);
      if (!comment) { throw 'Comment not found'; }
      if (user.email !== comment.email) { throw 'Must be original author to delete comment'; }
      comment.remove();
      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
