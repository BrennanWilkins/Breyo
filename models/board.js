const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  members: [],
  title: String,
  color: String,
  desc: String,
  creatorEmail: String
});

module.exports = mongoose.model('Board', BoardSchema);
