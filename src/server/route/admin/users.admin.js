var express = require('express');
var router = express.Router();
var logger = require('../../helpers/logging.helper');
var User = require('../../models/User');
var bodyParser = require('body-parser');
var constants = require('../../config/constants');
var verifyAuthToken = require('../../helpers/verifyAuthToken');

module.exports = router;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * GET /api/admin/users
 **/
router.get('/', verifyAuthToken, function(req, res) {
  User.findOne({ email: req.userEmail }, { password: 0, faceuser: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      logger.log('error', '[%s] Can not find user: %s', req.originalUrl, req.userEmail);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
    if (user.level > constants.USER_LEVEL_ADMIN) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }
    var options = {
      password: 0,
      faceuser: 0
    };
    User.find({}, options, function(err, users) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: users });
    });
  });
});

/**
 * POST /api/admin/users/update
 **/
router.post('/update', verifyAuthToken, function(req, res) {
  User.findOne({ email: req.userEmail }, { password: 0, facebook: 0 }, async function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      logger.log('error', '[%s] Can not find user: %s', req.originalUrl, req.userEmail);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
    if (user.level > constants.USER_LEVEL_ADMIN) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }

    try {
      for (var i of req.body.data) {
        await User.findByIdAndUpdate(i._id, i);
      }
    } catch (err) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
    }
    return res.send({ result: true });
  });
});
