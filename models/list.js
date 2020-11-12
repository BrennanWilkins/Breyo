const mongoose = require('mongoose');

const ItemSchema = new mongoose.Schema({
  title: String,
  isComplete: Boolean
});

const ChecklistSchema = new mongoose.Schema({
  title: String,
  items: [ItemSchema]
});

const CommentSchema = new mongoose.Schema({
  email: String,
  fullName: String,
  msg: String,
  date: String,
  cardID: String,
  listID: String
});

const CardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  checklists: [ChecklistSchema],
  labels: [],
  dueDate: {},
  isArchived: Boolean,
  members: [],
  comments: [CommentSchema]
});

const ListSchema = new mongoose.Schema({
  boardID: String,
  title: String,
  cards: [CardSchema],
  indexInBoard: Number,
  isArchived: Boolean
});

module.exports = mongoose.model('List', ListSchema);
