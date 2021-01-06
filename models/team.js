const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  title: String,
  desc: String,
  logo: String,
  url: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [String]
});

module.exports = mongoose.model('Team', TeamSchema);
