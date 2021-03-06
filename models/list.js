const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  title: String,
  isComplete: Boolean,
  member: {},
  dueDate: String
});

const ChecklistSchema = new Schema({
  title: String,
  items: [ItemSchema]
});

const CommentSchema = new Schema({
  email: String,
  fullName: String,
  msg: String,
  date: String,
  cardID: String,
  listID: String,
  likes: [String]
});

const CardSchema = new Schema({
  title: String,
  desc: String,
  checklists: [ChecklistSchema],
  labels: [],
  customLabels: [],
  dueDate: {},
  members: [],
  comments: [CommentSchema],
  customFields: [],
  votes: []
});

const ListSchema = new Schema({
  boardID: String,
  title: String,
  cards: [CardSchema],
  archivedCards: [CardSchema],
  indexInBoard: Number,
  isArchived: Boolean,
  isVoting: Boolean,
  limit: Number
});

ListSchema.index({ boardID: 1 });

module.exports = mongoose.model('List', ListSchema);
