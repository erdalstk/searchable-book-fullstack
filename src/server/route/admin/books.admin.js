const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const logger = require('../../helpers/logging.helper');
const Books = require('../../models/Books');
const User = require('../../models/User');
const constants = require('../../config/constants');
const verifyAuthToken = require('../../helpers/verifyAuthToken');

module.exports = router;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * GET /api/admin/books
 * */
router.get('/', verifyAuthToken, (req, res) => {
  User.findOne({ email: req.userEmail }, { password: 0, facebook: 0 }, (err, user) => {
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
    const options = {
      epub_link: 0,
      mobi_link: 0,
      pdf_link: 0,
      create_time: 0,
      update_time: 0
    };
    return Books.find({}, options, (err1, books) => {
      if (err1) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: books });
    });
  });
});

/**
 * POST /api/admin/books/update
 * */
router.post('/update', verifyAuthToken, (req, res) => {
  User.findOne({ email: req.userEmail }, { password: 0, facebook: 0 }, async (err, user) => {
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
      for (const i of req.body.data) { //eslint-disable-line
        await Books.findByIdAndUpdate(i._id, i); //eslint-disable-line
      }
    } catch (err1) {
      if (err1) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
    }
    return res.send({ result: true });
  });
});
