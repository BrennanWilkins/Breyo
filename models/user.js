const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  email: String,
  password: String,
  fullName: String,
  invites: [],
  teamInvites: [],
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }],
  adminBoards: [String],
  starredBoards: [String],
  recoverPassID: String,
  avatar: String,
  teams: [{ type: Schema.Types.ObjectId, ref: 'Team' }],
  adminTeams: [String]
});

UserSchema.index({ email: 1 });

module.exports = mongoose.model('User', UserSchema);
