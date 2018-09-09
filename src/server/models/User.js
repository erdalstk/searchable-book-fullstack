var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: String,
  password: String,
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('User', UserSchema);
