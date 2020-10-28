const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  members: [],
  title: String,
  activity: [],
  color: String
});

module.exports = mongoose.model('Board', BoardSchema);
