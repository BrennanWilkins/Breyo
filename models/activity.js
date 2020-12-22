const mongoose = require('mongoose');

const ActivitySchema = new mongoose.Schema({
  email: String,
  fullName: String,
  msg: String,
  date: Date,
  boardID: String,
  listID: String,
  cardID: String,
  boardMsg: String,
  commentID: String,
  cardTitle: String
});

ActivitySchema.index({ boardID: 1, date: -1 });

module.exports = mongoose.model('Activity', ActivitySchema);
