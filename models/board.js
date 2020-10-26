const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  members: [],
  title: String,
  activity: []
});

module.exports = mongoose.model('Board', BoardSchema);
