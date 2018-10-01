const express = require('express');

const router = express.Router();
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const request = require('request');
const nodeMailer = require('../helpers/nodemailer.helper');
const logger = require('../helpers/logging.helper');
const config = require('../config/main');
const User = require('../models/User');
const verifyAuthToken = require('../helpers/verifyAuthToken');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');
const constants = require('../config/constants');

module.exports = router;

// Handle json body request
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 *  Routes
 * */
router.post('/register', verifyApiAccessToken, (req, res) => {
  if (!req.body || !req.body.name || !req.body.email || !req.body.password) {
    return res
      .status(400)
      .send({ result: false, message: 'Name and email and password must not empty' });
  }
  if (req.body.password.length < 6) {
    return res
      .status(400)
      .send({ result: false, message: 'Password does not follow password policy' });
  }
  return User.findOne({ email: req.body.email }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (user) {
      logger.log('info', '[%s] Email already exists: %s', req.originalUrl, user.email);
      return res.send({ result: false, message: 'Email already exists' });
    }
    const hashedPassword = bcrypt.hashSync(req.body.password, 8);
    return User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
        level: constants.USER_LEVEL_BASIC,
        enable: true,
        create_time: new Date(),
        update_time: new Date()
      },
      (err1, newUser) => {
        if (err) {
          logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
          if (err.name === 'ValidationError') {
            return res.status(500).send({ result: false, message: 'Incorrect email format' });
          }
          return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
        }
        // create token
        const token = jwt.sign({ email: newUser.email }, config.app.secret, {
          expiresIn: config.app.jwtExpireTime
        });
        return res.status(200).send({ result: true, token });
      }
    );
  });
});

router.post('/login', verifyApiAccessToken, (req, res) => {
  if (!req.body || !req.body.email || !req.body.password) {
    return res.status(401).send({ result: false, token: null });
  }
  return User.findOne({ email: req.body.email, enable: true }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (!user) {
      logger.log('info', '[%s] User not found: %s', req.originalUrl, req.body.email);
      return res.status(401).send({ result: false, message: 'User not found' });
    }
    if (!user.password) {
      logger.log(
        'info',
        '[%s] This user has logged in by Facebook before, please login with facebook',
        req.originalUrl
      );
      return res.status(401).send({
        result: false,
        message: 'This user has logged in by Facebook before, please login with facebook'
      });
    }
    const passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) {
      logger.log('info', '[%s] Incorrect password: %s', req.originalUrl, req.body.email);
      return res.status(401).send({ result: false, message: 'Incorrect password', token: null });
    }
    const token = jwt.sign({ email: user.email }, config.app.secret, {
      expiresIn: config.app.jwtExpireTime
    });
    return res.status(200).send({ result: true, token });
  });
});

router.get('/logout', verifyApiAccessToken, (req, res) => {
  res.status(200).send({ result: true, token: null });
});

router.post('/changepassword', verifyAuthToken, (req, res) => {
  if (!req.body || !req.body.email || !req.body.newPassword) {
    return res.status(400).send({ result: false, message: 'New password must not empty' });
  }
  if (req.userEmail !== req.body.email) {
    return res.status(400).send({ result: false, message: 'x-access-token and email not match' });
  }
  if (req.body.newPassword.length < 6) {
    return res
      .status(400)
      .send({ result: false, message: 'New password does not follow password policy' });
  }
  return User.findOne({ email: req.body.email, enable: true }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (!user) {
      logger.log('info', '[%s] User not found: %s', req.originalUrl, req.body.email);
      return res.status(500).send({ result: false, message: 'User not found' });
    }
    if (user.password) {
      if (!req.body.currentPassword) {
        return res.status(400).send({ result: false, message: 'Current password must not empty' });
      }
      const passwordIsValid = bcrypt.compareSync(req.body.currentPassword, user.password);
      if (!passwordIsValid) {
        logger.log('info', '[%s] Incorrect current password: %s', req.originalUrl, req.body.email);
        return res.send({ result: false, message: 'Incorrect current password', token: null });
      }
    }
    const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
    const updateUser = user;
    updateUser.password = hashedPassword;
    return updateUser
      .save()
      .then(() => {
        const token = jwt.sign({ email: updateUser.email }, config.app.secret, {
          expiresIn: config.app.jwtExpireTime
        });
        return res.status(200).send({ result: true, token });
      })
      .catch((err1) => {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.send({ result: false, message: 'Server Error' });
      });
  });
});

router.post('/resetpasswordrequest', verifyApiAccessToken, (req, res) => {
  if (!req.body || !req.body.email) {
    return res.status(400).send({ result: false, message: 'No email provided' });
  }
  return User.findOne({ email: req.body.email, enable: true }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (!user) {
      logger.log('info', '[%s] User not found: %s', req.originalUrl, req.body.email);
      return res.status(500).send({ result: false, message: 'User not found' });
    }
    const resetToken = jwt.sign({ email: user.email }, config.app.secret, {
      expiresIn: config.app.jwtResetPasswordExpireTime
    });
    // send email
    return nodeMailer
      .sendResetPasswordEmail(user.email, req.headers.host, resetToken)
      .then(() => {
        // update reset_password_token to user db
        const updateUser = user;
        updateUser.reset_password_token = resetToken;
        return updateUser
          .save()
          .then(() => res.status(200).send({ result: true }))
          .catch((err2) => {
            logger.log(
              'error',
              '[%s] DB Error, can not save reset_password_token: %s',
              req.originalUrl,
              err2.message
            );
            return res.send({ result: false, message: 'Server Error' });
          });
      })
      .catch((mailErr) => {
        logger.log('error', '[%s] Send Email Error: %s', req.originalUrl, mailErr.message);
        return res.status(500).send({ result: false, message: 'Send email error' });
      });
  });
});

router.post('/reset/:token', verifyApiAccessToken, (req, res) => {
  User.findOne({ reset_password_token: req.params.token, enable: true }, (err, user) => {
    if (!user) {
      logger.log('info', '[%s] Password reset token is invalid', req.originalUrl);
      return res.status(401).send({ result: false, message: 'Password reset token is invalid' });
    }
    return jwt.verify(req.params.token, config.app.secret, (verifyErr, decoded) => {
      if (verifyErr) {
        if (verifyErr.name === 'TokenExpiredError') {
          return res.status(401).send({
            result: false,
            message: 'Password reset token has expired'
          });
        }
        logger.log(
          'info',
          '[%s] Failed to verify password reset token: %s',
          req.originalUrl,
          verifyErr.message
        );
        return res.status(401).send({
          result: false,
          message: `[%s] Failed to verify password reset token: ${err.message}`
        });
      }
      // if everything good, proceed to reset pass
      const userEmail = decoded.email;
      if (!req.body || !req.body.newPassword) {
        return res.status(400).send({ result: false, message: 'New password must not empty' });
      }
      if (req.body.newPassword.length < 6) {
        return res
          .status(400)
          .send({ result: false, message: 'New password does not follow password policy' });
      }
      const hashedPassword = bcrypt.hashSync(req.body.newPassword, 8);
      const updateUser = user;
      updateUser.password = hashedPassword;
      updateUser.reset_password_token = '';
      return updateUser
        .save()
        .then(() => {
          nodeMailer.sendResetPasswordDoneEmail(userEmail);
          res.status(200).send({ result: true, data: userEmail });
        })
        .catch((err1) => {
          logger.log(
            'error',
            '[%s] DB Error, can not save new password: %s',
            req.originalUrl,
            err1.message
          );
          return res.send({ result: false, message: 'Server Error' });
        });
    });
  });
});

router.get('/me', verifyAuthToken, (req, res) => {
  User.findOne({ email: req.userEmail, enable: true }, { 'facebook.token': 0 }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (!user) {
      logger.log('info', '[%s] User not found: %s', req.originalUrl, req.body.email);
      return res.status(404).send({ result: false, message: 'User not found' });
    }
    const resUser = JSON.parse(JSON.stringify(user));
    if (user.password) {
      resUser.hasPassword = true;
      delete resUser.password;
    }
    return res.status(200).send({ result: true, data: resUser });
  });
});

router.get('/checkemail', verifyApiAccessToken, (req, res) => {
  const { q } = req.query;
  if (!q) return res.send({ result: false, message: 'Empty query string' });
  return User.findOne({ email: q, enable: true }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (!user) return res.send({ result: true, emailExists: false });
    return res.send({ result: true, emailExists: true });
  });
});

router.post('/facebook', verifyApiAccessToken, (req, res) => {
  User.findOne({ email: req.body.email, enable: true }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
    }
    if (user) {
      // already logged in before, now verify x-access-token
      return request.get(constants.FB_GRAPH_API_URL + req.body.token, (err1, res1, body1) => {
        if (!err1 && res1.statusCode === 200) {
          const fbGraphRes = JSON.parse(body1);
          if (fbGraphRes.id) {
            if (fbGraphRes.id === req.body.id) {
              // save new data to db
              const updateUser = user;
              updateUser.name = req.body.name;
              updateUser.facebook.id = req.body.id;
              updateUser.facebook.token = req.body.token;

              return updateUser
                .save()
                .then(() => {
                  // send token
                  const token = jwt.sign({ email: user.email }, config.app.secret, {
                    expiresIn: config.app.jwtExpireTime
                  });
                  return res.status(200).send({ result: true, token });
                })
                .catch((err2) => {
                  logger.log('error', '[%s] DB Error: %s', req.originalUrl, err2.message);
                  return res.send({ result: false, message: 'Server Error' });
                });
            }
            logger.log(
              'info',
              '[%s] FB Graph API Error: %s',
              req.originalUrl,
              'facebook user id is not match'
            );
            return res
              .status(401)
              .send({ result: false, message: 'Can not verify Facebook Access Token' });
          }
        }
        logger.log(
          'error',
          '[%s] FB Graph API Error. Status code: %s',
          req.originalUrl,
          res1.statusCode
        );
        return res
          .status(401)
          .send({ result: false, message: 'Can not verify Facebook Access Token' });
      });
    }
    return User.create(
      {
        name: req.body.name,
        email: req.body.email,
        facebook: {
          id: req.body.id,
          token: req.body.token
        },
        level: constants.USER_LEVEL_BASIC,
        enable: true,
        create_time: new Date(),
        update_time: new Date()
      },
      (err1, newUser) => {
        if (err) {
          logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
          return res.status(500).send({ result: false, message: constants.STR_SERVER_ERROR });
        }
        // create token
        const token = jwt.sign({ email: newUser.email }, config.app.secret, {
          expiresIn: config.app.jwtExpireTime
        });
        return res.status(200).send({ result: true, token });
      }
    );
  });
});
