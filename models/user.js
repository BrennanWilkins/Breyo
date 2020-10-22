const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  displayName: String,
  invites: [],
  boards: []
});

module.exports = mongoose.model('User', UserSchema);
