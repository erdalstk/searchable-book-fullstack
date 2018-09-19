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

router.get('/all', verifyAuthToken, function(req, res) {
  User.findOne({ email: req.userEmail }, { password: 0, facebook: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      logger.log('error', '[%s] Can not find user: %s', req.originalUrl, req.userEmail);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
    if (!user.level || user.level < constants.USER_LEVEL_ADMIN) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }
    User.find({}, { password: 0, facebook: 0 }, function(err, users) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: users });
    });
  });
});

router.get('/:email', verifyAuthToken, function(req, res) {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  User.findOne({ email: req.params.email }, { password: 0, facebook: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      return res.send({ result: false, message: 'User not found' });
    }
    return res.send({ result: true, data: user });
  });
});
