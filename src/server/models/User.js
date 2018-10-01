const mongoose = require('mongoose');
const constants = require('../config/constants');

const UserSchema = new mongoose.Schema({
  name: String,
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    match: /^\w+([\.\-\+]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/ // eslint-disable-line
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
  reset_password_token: String,
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('User', UserSchema);
