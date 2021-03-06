const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CustomLabelSchema = new Schema({
  color: String,
  title: String
});

const CustomFieldSchema = new Schema({
  fieldType: String,
  fieldTitle: String
});

const BoardSchema = new Schema({
  members: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  admins: [String],
  title: String,
  color: String,
  desc: String,
  creator: {},
  teamID: String,
  customLabels: [CustomLabelSchema],
  customFields: [CustomFieldSchema]
});

module.exports = mongoose.model('Board', BoardSchema);
