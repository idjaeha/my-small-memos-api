var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var accountSchema = new Schema({
  id: String,
  password: String,
  createdDate: Number
});

module.exports = mongoose.model("account", accountSchema);
