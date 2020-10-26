const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  invites: [],
  boards: []
});

module.exports = mongoose.model('User', UserSchema);
