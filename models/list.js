const mongoose = require('mongoose');

const ChecklistSchema = new mongoose.Schema({
  title: String,
  items: []
});

const CardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  checklists: [ChecklistSchema],
  labels: [],
  dueDate: {}
});

const ListSchema = new mongoose.Schema({
  boardID: String,
  title: String,
  cards: [CardSchema],
  indexInBoard: Number
});

module.exports = mongoose.model('List', ListSchema);
