var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var constants = require('../config/constants');

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
  level: { type: Number, default: constants.USER_LEVEL_BASIC },
  profile_picture: String,
  enable: { type: Boolean, default: true },
  active: { type: Boolean, default: true },
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('User', UserSchema);
