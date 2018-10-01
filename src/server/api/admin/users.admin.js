const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const logger = require('../../helpers/logging.helper');
const User = require('../../models/User');
const constants = require('../../config/constants');
const verifyAuthToken = require('../../helpers/verifyAuthToken');

module.exports = router;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 * GET /api/admin/users
 * */
router.get('/', verifyAuthToken, (req, res) => {
  User.findOne({ email: req.userEmail }, { password: 0, faceuser: 0 }, (err, user) => {
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
    const options = {
      password: 0,
      faceuser: 0
    };
    return User.find({}, options, (err1, users) => {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: users });
    });
  });
});

/**
 * POST /api/admin/users/update
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
    if (user.level > constants.USER_LEVEL_ADMIN) {
      logger.log('info', '[%s] Not enough authority: %s', req.originalUrl, user.email);
      return res.status(403).send({ result: false, message: 'Not enough authority' });
    }

    try {
      for (const i of req.body.data) { //eslint-disable-line
        await User.findByIdAndUpdate(i._id, i); //eslint-disable-line
      }
    } catch (err1) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
    }
    return res.send({ result: true });
  });
});
