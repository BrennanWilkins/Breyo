const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TeamSchema = new Schema({
  title: String,
  desc: String,
  logo: String,
  url: String,
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  boards: [{ type: Schema.Types.ObjectId, ref: 'Board' }]
});

module.exports = mongoose.model('Team', TeamSchema);
