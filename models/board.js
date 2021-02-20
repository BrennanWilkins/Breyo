const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const BoardSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [String],
  title: String,
  color: String,
  desc: String,
  creator: {},
  teamID: String
});

module.exports = mongoose.model('Board', BoardSchema);
