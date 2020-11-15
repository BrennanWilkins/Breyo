const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  email: String,
  fullName: String,
  msg: String,
  date: Date,
  boardID: String,
  listID: String,
  cardID: String,
  boardMsg: String
});

module.exports = mongoose.model('Activity', ActivitySchema);
