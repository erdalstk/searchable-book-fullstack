var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var User = require('../models/User');
var Books = require('../models/Books');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');
var verifyAuthToken = require('../helpers/verifyAuthToken');
var constants = require('../config/constants');

//Routes will go here
module.exports = router;

router.get('/:email', verifyAuthToken, function(req, res) {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  User.findOne({ email: req.params.email, enable: true }, { facebook: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      return res.send({ result: false, message: 'User not found' });
    }
    let resUser = JSON.parse(JSON.stringify(user));
    if (user.password) {
      resUser.hasPassword = true;
      delete resUser.password;
    }
    return res.send({ result: true, data: resUser });
  });
});
