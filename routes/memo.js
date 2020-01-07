var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var memoSchema = new Schema({
  key: Number,
  writer: String,
  title: String,
  content: String,
  color: String,
  date: Number
});

module.exports = mongoose.model("memo", memoSchema);
