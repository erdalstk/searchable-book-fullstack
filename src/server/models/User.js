var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  name: String,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  },
  password: String,
  facebook: {
    id: String,
    token: String
  },
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('User', UserSchema);
