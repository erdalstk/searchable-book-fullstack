var express = require('express');
var router = express.Router();
var logger = require('../../helpers/logging.helper');
var Books = require('../../models/Books');
var User = require('../../models/User');
var bodyParser = require('body-parser');
var constants = require('../../config/constants');
var verifyAuthToken = require('../../helpers/verifyAuthToken');

module.exports = router;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * GET /api/admin/books
 **/
router.get('/', verifyAuthToken, function(req, res) {
  User.findOne({ email: req.userEmail }, { password: 0, facebook: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      logger.log('error', '[%s] Can not find user: %s', req.originalUrl, req.userEmail);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
    if (user.level > constants.USER_LEVEL_MOD) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }
    var options = {
      epub_link: 0,
      mobi_link: 0,
      pdf_link: 0,
      create_time: 0,
      update_time: 0
    };
    Books.find({}, options, function(err, books) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: books });
    });
  });
});

/**
 * POST /api/admin/books/update
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
    if (user.level > constants.USER_LEVEL_MOD) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }

    try {
      for (var i of req.body.data) {
        await Books.findByIdAndUpdate(i._id, i);
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
