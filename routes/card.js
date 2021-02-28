const router = require('express').Router();
const List = require('../models/list');
const Board = require('../models/board');
const User = require('../models/user');
const { body, param } = require('express-validator');
const auth = require('../middleware/auth');
const validate = require('../middleware/validate');
const useIsMember = require('../middleware/useIsMember');
const { addActivity } = require('./activity');
const Activity = require('../models/activity');
const { format } = require('date-fns');
const isThisYear = require('date-fns/isThisYear');
const { areAllMongo } = require('../middleware/validate');

const LABEL_COLORS = ['#60C44D', '#F5DD2A', '#FF8C00', '#F60000', '#3783FF', '#4815AA'];

router.use(auth);
// user must be board member for all card routes

const getListAndValidate = async (boardID, listID, cardID) => {
  const list = await List.findOne({ _id: listID, boardID });
  if (!list) { throw 'List data not found'; }
  if (list.isArchived) { throw 'Cannot update a card in an archived list.'; }
  if (!cardID) { return list; }

  const card = list.cards.id(cardID);
  if (!card) { throw 'Card data not found'; }
  return [list, card];
};

// create a new card
router.post('/',
  validate([body('boardID').isMongoId(), body('listID').isMongoId(), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, title } = req.body;
      const list = await getListAndValidate(boardID, listID);

      const card = { title, desc: '', checklists: [], labels: [], dueDate: null, members: [],
      comments: [], roadmapLabel: null, customFields: [], votes: [], customLabels: [] };
      list.cards.push(card);
      const cardID = list.cards[list.cards.length - 1]._id;

      const actionData = { msg: 'created this card', boardMsg: `added **(link)${title}** to ${list.title}`,
      cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ cardID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update card title
router.put('/title',
  validate([...areAllMongo(['cardID', 'boardID', 'listID'], 'body'), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { cardID, listID, boardID, title } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const oldTitle = card.title;
      card.title = title;

      const actionData = { msg: `renamed this card from ${oldTitle} to ${title}`, boardMsg: `renamed **(link)${title}** from ${oldTitle} to ${title}`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update card description
router.put('/desc',
  validate([...areAllMongo(['cardID', 'boardID', 'listID'], 'body'), body('desc').isLength({ max: 600 })]),
  useIsMember,
  async (req, res) => {
    try {
      const [list, card] = await getListAndValidate(req.body.boardID, req.body.listID, req.body.cardID);

      card.desc = req.body.desc;
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add label to card
router.post('/label',
  validate([...areAllMongo(['listID', 'boardID', 'cardID'], 'body'), body('color').notEmpty()]),
  useIsMember,
  async (req, res) => {
    try {
      const { color, listID, cardID, boardID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.labels = [...card.labels, color];
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// remove label from card
router.put('/label/remove',
  validate([...areAllMongo(['listID', 'boardID', 'cardID'], 'body'), body('color').notEmpty()]),
  useIsMember,
  async (req, res) => {
    try {
      const { color, cardID, listID, boardID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const labelIndex = card.labels.indexOf(color);
      if (labelIndex === -1) { throw 'Label not found in cards labels'; }
      card.labels.splice(labelIndex, 1);
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add roadmap label to card
router.post('/roadmapLabel',
  validate([...areAllMongo(['listID', 'boardID', 'cardID'], 'body'), body('color').notEmpty()]),
  useIsMember,
  async (req, res) => {
    try {
      const { color, cardID, listID, boardID } = req.body;
      if (!LABEL_COLORS.includes(color)) { throw 'Invalid label color'; }
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.roadmapLabel = color;
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// remove roadmap label from card
router.delete('/roadmapLabel/:cardID/:listID/:boardID',
  validate(areAllMongo(['listID', 'boardID', 'cardID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, cardID, boardID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.roadmapLabel = null;
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// toggle card due date as complete/incomplete
router.put('/dueDate/isComplete',
  validate(areAllMongo(['listID', 'boardID', 'cardID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { cardID, listID, boardID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      if (!card.dueDate) { throw 'No due date found for card'; }
      card.dueDate = { ...card.dueDate, isComplete: !card.dueDate.isComplete };

      const completeText = card.dueDate.isComplete ? 'complete' : 'incomplete';
      const actionData = { msg: `marked the due date as ${completeText}`, boardMsg: `marked the due date on **(link)${card.title}** as ${completeText}`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add due date to card
router.post('/dueDate',
  validate([...areAllMongo(['listID', 'boardID', 'cardID'], 'body'), body('dueDate').notEmpty(), body('startDate').exists()]),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID, dueDate, startDate } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      if (isNaN(new Date(dueDate).getDate())) { throw 'Invalid due date format'; }
      if (startDate !== null && isNaN(new Date(startDate).getDate())) { throw 'Invalid start date format'; }
      card.dueDate = { dueDate, startDate, isComplete: false };

      // format date in action & show year in date if not current year
      let date = new Date(dueDate);
      date = isThisYear(date) ? format(date, `MMM d 'at' h:mm aa`) : format(date, `MMM d, yyyy 'at' h:mm aa`);

      const actionData = { msg: `set this card to be due ${date}`, boardMsg: `set **(link)${card.title}** to be due ${date}`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// remove due date from card
router.delete('/dueDate/:cardID/:listID/:boardID',
  validate(areAllMongo(['listID', 'boardID', 'cardID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.dueDate = null;

      const actionData = { msg: `removed the due date from this card`, boardMsg: `removed the due date from **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add checklist to card
router.post('/checklist',
  validate([...areAllMongo(['listID', 'boardID', 'cardID'], 'body'), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, title } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.checklists.push({ title, items: [] });
      const checklistID = card.checklists[card.checklists.length - 1]._id;

      const actionData = { msg: `added checklist ${title} to this card`, boardMsg: `added checklist ${title} to **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ checklistID, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// remove checklist from card
router.delete('/checklist/:checklistID/:cardID/:listID/:boardID',
  validate(areAllMongo(['listID', 'boardID', 'cardID', 'checklistID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, boardID, cardID, checklistID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const checklist = card.checklists.id(checklistID);
      checklist.remove();

      const actionData = { msg: `removed checklist ${checklist.title} from this card`, boardMsg: `removed checklist ${checklist.title} from **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update checklist title
router.put('/checklist/title',
  validate([...areAllMongo(['listID', 'boardID', 'cardID', 'checklistID'], 'body'), body('title').isLength({ min: 1, max: 200 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, checklistID, title } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'No checklist data found'; }
      const oldTitle = checklist.title;
      checklist.title = title;

      const actionData = { msg: `renamed checklist ${oldTitle} to ${title}`, boardMsg: `renamed checklist ${oldTitle} to ${title} in **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add item to a checklist
router.post('/checklist/item',
  validate([...areAllMongo(['listID', 'boardID', 'cardID', 'checklistID'], 'body'), body('title').isLength({ min: 1, max: 300 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, cardID, checklistID, boardID, title } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'No checklist data found'; }
      checklist.items.push({ title, isComplete: false });
      const itemID = checklist.items[checklist.items.length - 1]._id;

      await list.save();

      res.status(200).json({ itemID });
    } catch (err) { res.sendStatus(500); }
  }
);

// toggle checklist item as complete/incomplete
router.put('/checklist/item/isComplete',
  validate(areAllMongo(['listID', 'boardID', 'cardID', 'checklistID', 'itemID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, checklistID, itemID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'Card checklist not found'; }
      const item = checklist.items.id(itemID);
      if (!item) { throw 'Checklist item not found'; }
      item.isComplete = !item.isComplete;

      const cardMsg = item.isComplete ? `completed ${item.title} in checklist ${checklist.title}` : `marked ${item.title} incomplete in checklist ${checklist.title}`;
      const boardMsg = item.isComplete ? `completed ${item.title} in **(link)${card.title}**` : `marked ${item.title} incomplete in **(link)${card.title}**`;
      const actionData = { msg: cardMsg, boardMsg, cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// update checklist item title
router.put('/checklist/item/title',
  validate([...areAllMongo(['listID', 'boardID', 'cardID', 'checklistID', 'itemID'], 'body'), body('title').isLength({ min: 1, max: 300 })]),
  useIsMember,
  async (req, res) => {
    try {
      const [list, card] = await getListAndValidate(req.body.boardID, req.body.listID, req.body.cardID);

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

// delete item from checklist
router.put('/checklist/item/delete',
  validate(areAllMongo(['listID', 'boardID', 'cardID', 'checklistID', 'itemID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const [list, card] = await getListAndValidate(req.body.boardID, req.body.listID, req.body.cardID);

      card.checklists.id(req.body.checklistID).items.id(req.body.itemID).remove();

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// move card inside the same list
router.put('/moveCard/sameList',
  validate([body('boardID').isMongoId(), body('listID').isMongoId(), body('sourceIndex').isInt({ min: 0 }), body('destIndex').isInt({ min: 0 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, sourceIndex, destIndex } = req.body;
      const list = await getListAndValidate(boardID, listID);
      if (sourceIndex >= list.cards.length || destIndex >= list.cards.length) {
        throw 'Invalid source or dest index';
      }

      // remove card from original index
      const card = list.cards.splice(sourceIndex, 1)[0];
      if (!card) { throw 'Card not found in list'; }

      // add card back to new index
      list.cards.splice(destIndex, 0, card);

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// move card to a different list
router.put('/moveCard/diffList',
  validate([...areAllMongo(['boardID', 'sourceID', 'targetID'], 'body'), body('sourceIndex').isInt({ min: 0 }), body('destIndex').isInt({ min: 0 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, sourceID, targetID, sourceIndex, destIndex } = req.body;
      const [sourceList, destList] = await Promise.all([getListAndValidate(boardID, sourceID), getListAndValidate(boardID, targetID)]);
      if (sourceIndex >= sourceList.cards.length || destIndex > destList.cards.length) {
        throw 'Invalid source or dest index';
      }

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

// create a copy of a card
router.post('/copy',
  validate(
    [...areAllMongo(['boardID', 'sourceListID', 'destListID', 'cardID'], 'body'),
    body('title').isLength({ min: 1, max: 200 }),
    body('destIndex').isInt({ min: 0 }),
    body('keepLabels').isBoolean(),
    body('keepChecklists').isBoolean()]
  ),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, sourceListID, destListID, cardID, title, destIndex, keepLabels, keepChecklists } = req.body;
      const [[sourceList, sourceCard], destList] = await Promise.all([
        getListAndValidate(boardID, sourceListID, cardID),
        getListAndValidate(boardID, destListID)
      ]);
      if (destIndex > destList.cards.length) { throw 'Invalid destination index'; }

      // create nested copy of card checklists & card labels if requested
      const newCard = {
        title,
        labels: keepLabels ? sourceCard.labels : [],
        roadmapLabel: keepLabels ? sourceCard.roadmapLabel : null,
        checklists: keepChecklists ? sourceCard.checklists.map(checklist => ({
          items: checklist.items.map(item => ({ title: item.title, isComplete: item.isComplete })),
          title: checklist.title
        })) : [],
        customFields: sourceCard.customFields.map(field => ({
          fieldType: field.fieldType,
          fieldTitle: field.fieldTitle,
          value: field.value
        })),
        desc: '',
        dueDate: sourceCard.dueDate,
        members: sourceCard.members,
        comments: [],
        votes: [],
        customLabels: keepLabels ? sourceCard.customLabels : []
      };

      destList.cards.splice(destIndex, 0, newCard);
      const updatedCard = destList.cards[destIndex];

      const actionData = { msg: `copied this card to list ${destList.title}`, boardMsg: `copied **(link)${title}** to list ${destList.title}`,
        cardID: updatedCard._id, listID: destListID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), destList.save()]);

      res.status(200).json({ card: updatedCard, newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// send a card to archive
router.post('/archive',
  validate(areAllMongo(['boardID', 'listID', 'cardID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      list.archivedCards.unshift(card);
      card.remove();

      const actionData = { msg: `archived this card`, boardMsg: `archived **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// send card back to list from archive
router.put('/archive/recover',
  validate(areAllMongo(['boardID', 'listID', 'cardID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.body;
      const list = await List.findOne({ _id: listID, boardID });
      if (!list) { throw 'No list data found'; }

      const card = list.archivedCards.id(cardID);
      if (!card) { throw 'No card data found'; }
      list.cards.push(card);
      card.remove();

      const actionData = { msg: `recovered this card`, boardMsg: `recovered **(link)${card.title}**`,
      cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// permanently delete a card
router.delete('/archive/:cardID/:listID/:boardID',
  validate(areAllMongo(['boardID', 'listID', 'cardID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.params;
      const list = await List.findOne({ _id: listID, boardID });
      if (!list) { throw 'No list data found'; }

      const card = list.archivedCards.id(cardID);
      if (!card) { throw 'Card data not found'; }
      card.remove();

      const newActivity = new Activity({ msg: null, boardMsg: `deleted ${card.title} from list ${list.title}`,
        email: req.email, fullName: req.fullName, cardID: null, listID: null, boardID, date: new Date() });

      await Promise.all([newActivity.save(), list.save(), Activity.deleteMany({ cardID })]);

      // fetch new recent 20 activities after deleting all of card's activity
      const activity = await Activity.find({ boardID }).sort('-date').limit(20).lean();
      if (!activity) { throw 'No board activity found'; }

      res.status(200).json({ activity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add card member
router.post('/members',
  validate([...areAllMongo(['boardID', 'listID', 'cardID'], 'body'), body('email').isEmail()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, email } = req.body;
      const [[list, card], user] = await Promise.all([
        getListAndValidate(boardID, listID, cardID),
        User.findOne({ email }).select('fullName boards').lean()
      ]);
      if (!user) { throw 'User data not found'; }

      if (!user.boards.find(id => String(id) === boardID)) { throw 'User must be member of board'; }

      // if user already member of the card
      if (card.members.find(member => member.email === email)) { throw 'User already a member of the card'; }

      card.members.push({ email, fullName: user.fullName });

      const actionData = { msg: `added ${user.fullName} to this card`, boardMsg: `added ${user.fullName} to **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// remove a card member
router.delete('/members/:email/:cardID/:listID/:boardID',
  validate([...areAllMongo(['boardID', 'listID', 'cardID'], 'params'), param('email').isEmail()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, email } = req.params;
      const [[list, card], user] = await Promise.all([
        getListAndValidate(boardID, listID, cardID),
        User.findOne({ email }).select('fullName').lean()
      ]);
      if (!user) { throw 'User data not found'; }

      card.members = card.members.filter(member => member.email !== email);

      const actionData = { msg: `removed ${user.fullName} from this card`, boardMsg: `removed ${user.fullName} from **(link)${card.title}**`,
        cardID, listID, boardID, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ newActivity });
    } catch (err) { res.sendStatus(500); }
  }
);

// add comment to card
router.post('/comments',
  validate([...areAllMongo(['boardID', 'listID', 'cardID'], 'body'), body('msg').isLength({ min: 1, max: 400 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, msg } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const date = String(new Date());
      card.comments.push({ email: req.email, fullName: req.fullName, date, msg, cardID, listID, likes: [] });
      const commentID = card.comments[card.comments.length - 1]._id;

      const actionData = { msg, boardMsg: msg, cardID, listID, boardID, commentID, cardTitle: card.title, email: req.email, fullName: req.fullName };

      const [newActivity] = await Promise.all([addActivity(actionData), list.save()]);

      res.status(200).json({ commentID, cardTitle: card.title, newActivity, date });
    } catch (err) { res.sendStatus(500); }
  }
);

// edit comment msg, must be original author to edit
router.put('/comments',
  validate([...areAllMongo(['boardID', 'listID', 'cardID', 'commentID'], 'body'), body('msg').isLength({ min: 1, max: 400 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { listID, cardID, commentID, msg, boardID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const comment = card.comments.id(commentID);
      if (!comment) { throw 'Comment not found'; }
      if (req.email !== comment.email) { throw 'User must be original author to edit'; }
      comment.msg = msg;

      await Promise.all([list.save(), Activity.updateOne({ commentID }, { msg, boardMsg: msg })]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// delete a comment, must be original author
router.delete('/comments/:commentID/:cardID/:listID/:boardID',
  validate(areAllMongo(['boardID', 'listID', 'cardID', 'commentID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, commentID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const comment = card.comments.id(commentID);
      if (!comment) { throw 'Comment not found'; }
      if (req.email !== comment.email) { throw 'Must be original author to delete comment'; }
      comment.remove();

      await Promise.all([list.save(), Activity.deleteOne({ commentID })]);

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// move the position of a checklist item
router.put('/checklist/moveItem',
  validate([
    ...areAllMongo(['boardID', 'listID', 'cardID', 'checklistID'], 'body'),
    body('sourceIndex').isInt({ min: 0 }),
    body('destIndex').isInt({ min: 0 })
  ]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, cardID, listID, checklistID, sourceIndex, destIndex } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const checklist = card.checklists.id(checklistID);
      if (!checklist) { throw 'Checklist not found'; }
      if (destIndex >= checklist.items.length || sourceIndex >= checklist.items.length) {
        throw 'Invalid source or dest index';
      }

      const item = checklist.items.splice(sourceIndex, 1)[0];
      checklist.items.splice(destIndex, 0, item);

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add/remove like from a card comment
router.put('/comments/like',
  validate(areAllMongo(['boardID', 'listID', 'cardID', 'commentID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { commentID, cardID, listID, boardID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const comment = card.comments.id(commentID);
      if (!comment) { throw 'Comment not found'; }

      if (comment.likes.includes(req.email)) {
        comment.likes = comment.likes.filter(like => like !== req.email);
      } else {
        comment.likes = [...comment.likes, req.email];
      }

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add a custom field to card
router.post('/customField',
  validate([...areAllMongo(['boardID', 'listID', 'cardID'], 'body'), body('fieldType').notEmpty(), body('fieldTitle').isLength({ min: 1, max: 150 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, fieldType, fieldTitle } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);
      const fieldTypes = ['Text', 'Number', 'Date', 'Checkbox'];
      if (!fieldTypes.includes(fieldType)) { throw 'Invalid field type'; }

      const value = fieldType === 'Checkbox' ? false : fieldType === 'Date' ? null : '';
      card.customFields.push({ fieldType, fieldTitle, value });
      const fieldID = card.customFields[card.customFields.length - 1]._id;

      await list.save();

      res.status(200).json({ fieldID });
    } catch (err) { res.sendStatus(500); }
  }
);

// edit a card custom field title
router.put('/customField/title',
  validate([...areAllMongo(['boardID', 'listID', 'cardID', 'fieldID'], 'body'), body('fieldTitle').isLength({ min: 1, max: 150 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, fieldID, fieldTitle } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const field = card.customFields.id(fieldID);
      if (!field) { throw 'Custom field not found'; }
      field.fieldTitle = fieldTitle;

      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// edit the value of a card custom field
router.put('/customField/value',
  validate([...areAllMongo(['boardID', 'listID', 'cardID', 'fieldID'], 'body'), body('value').exists()]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, fieldID, value } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);
      const field = card.customFields.id(fieldID);
      if (!field) { throw 'Custom field not found'; }

      switch (field.fieldType) {
        case 'Text': {
          if (typeof value !== 'string') { throw 'Invalid value type'; }
          if (value.length > 300) { throw 'Invalid field value length'; }
          field.value = value;
          break;
        }
        case 'Checkbox': {
          field.value = !field.value;
          break;
        }
        case 'Number': {
          if (isNaN(value) || value > 1e20 || value < -1e20) { throw 'Field value is not a number'; }
          // if value is float then can have max 12 decimal places
          field.value = value % 1 ? String(+parseFloat(value).toFixed(12)) : value;
          break;
        }
        case 'Date': {
          if (value && isNaN(new Date(value).getDate())) { throw 'Field value is not a date'; }
          // date value defaults to null if empty
          field.value = value !== '' ? value : null;
          break;
        }
        default: throw 'Invalid field type';
      }

      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// delete a custom field from card
router.delete('/customField/:fieldID/:cardID/:listID/:boardID',
  validate(areAllMongo(['boardID', 'listID', 'cardID', 'fieldID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, fieldID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      const field = card.customFields.id(fieldID);
      if (!field) { throw 'Field not found'; }
      field.remove();
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// change position of custom field in card
router.put('/customField/move',
  validate([...areAllMongo(['boardID', 'listID', 'cardID'], 'body'), body('sourceIndex').isInt({ min: 0 }), body('destIndex').isInt({ min: 0 })]),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, sourceIndex, destIndex } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      if (sourceIndex >= card.customFields.length || destIndex >= card.customFields.length) {
        throw 'Invalid indexes';
      }
      const field = card.customFields.splice(sourceIndex, 1)[0];
      card.customFields.splice(destIndex, 0, field);

      await list.save();
      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// cast a vote or remove vote on a card in a list with voting
router.post('/vote',
  validate(areAllMongo(['boardID', 'listID', 'cardID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID } = req.body;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);
      if (!list.isVoting) { throw 'List voting is not active'; }

      // add vote if user hasn't voted else remove vote
      const idx = card.votes.findIndex(vote => vote.email === req.email);
      if (idx === -1) { card.votes.push({ email: req.email, fullName: req.fullName }); }
      else { card.votes.splice(idx, 1); }

      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// add a custom label to a card
router.post('/customLabel',
  validate(areAllMongo(['boardID', 'listID', 'cardID', 'labelID'], 'body')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, labelID } = req.body;
      const [board, [list, card]] = await Promise.all([
        Board.findById(boardID).select('customLabels').lean(),
        getListAndValidate(boardID, listID, cardID)
      ]);
      if (!board) { throw 'No board data found'; }
      if (!board.customLabels.find(label => String(label._id) === labelID)) { throw 'Invalid labelID'; }

      card.customLabels.push(labelID);
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

// remove a custom label from a card
router.delete('/customLabel/:boardID/:listID/:cardID/:labelID',
  validate(areAllMongo(['boardID', 'listID', 'cardID', 'labelID'], 'params')),
  useIsMember,
  async (req, res) => {
    try {
      const { boardID, listID, cardID, labelID } = req.params;
      const [list, card] = await getListAndValidate(boardID, listID, cardID);

      card.customLabels = card.customLabels.filter(id => id !== labelID);
      await list.save();

      res.sendStatus(200);
    } catch (err) { res.sendStatus(500); }
  }
);

module.exports = router;
