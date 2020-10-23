const mongoose = require('mongoose');

const BoardSchema = new mongoose.Schema({
  members: [],
  title: String
});

module.exports = mongoose.model('Board', BoardSchema);
