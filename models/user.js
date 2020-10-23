const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  username: String,
  displayName: String,
  invites: [],
  boards: [],
  activity: []
});

module.exports = mongoose.model('User', UserSchema);
