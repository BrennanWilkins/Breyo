const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  email: String,
  password: String,
  fullName: String,
  invites: [],
  boards: []
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
