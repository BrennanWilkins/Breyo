const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  title: String,
  desc: String,
  checklists: [],
  labels: [],
  dueDate: String,
  indexInBoard: Number
});

const ListSchema = new mongoose.Schema({
  boardID: String,
  title: String,
  cards: [CardSchema],
  indexInBoard: Number
});

module.exports = mongoose.model('List', ListSchema);
