var express = require('express');
var config = require('../config/main');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var verifyToken = require('../helpers/verifyToken');
var request = require('request');

module.exports = router;

// Handle json body request
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

/**
 *  Routes
 **/
router.post('/register', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'Error on the server' });
    if (user) return res.send({ result: false, message: 'Email already exists' });
    var hashedPassword = bcrypt.hashSync(req.body.password, 8);
    User.create(
      {
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
      },
      function(err, user) {
        if (err) return res.status(500).send({ result: false, message: 'There was a problem registering the user.' });
        // create token
        var token = jwt.sign({ id: user._id }, config.app.secret, {
          expiresIn: 86400 // expires in 24 hours
        });
        res.status(200).send({ result: true, token: token });
      }
    );
  });
});

router.post('/login', function(req, res) {
  if (!req.body || !req.body.email || !req.body.password) return res.status(401).send({ result: false, token: null });
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'Error on the server' });
    if (!user) return res.send({ result: false, message: 'User not found' });
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
    if (!passwordIsValid) return res.status(401).send({ result: false, message: 'Incorrect password', token: null });
    var token = jwt.sign({ id: user._id }, config.app.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ result: true, token: token });
  });
});

router.get('/logout', function(req, res) {
  res.status(200).send({ result: true, token: null });
});

router.get('/me', verifyToken, function(req, res) {
  User.findById(req.userId, { password: 0, facebook: 0 }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'There was a problem finding the user.' });
    if (!user) return res.status(404).send({ result: false, message: 'No user found.' });
    res.status(200).send({ result: true, user: user });
  });
});

router.get('/checkemail', function(req, res) {
  var q = req.query.q;
  if (!q) return res.send({ result: false });
  User.findOne({ email: q }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'Error on the server' });
    if (!user) return res.send({ result: true });
    return res.send({ result: false });
  });
});

router.post('/facebook', function(req, res) {
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'Error on the server' });
    if (user) {
      // already logged in before, now verify accessToken
      request.get('https://graph.facebook.com/me?access_token=' + req.body.token, function(err1, res1, body1) {
        if (!err1 && res1.statusCode == 200) {
          var fbGraphRes = JSON.parse(body1);
          if (fbGraphRes.id) {
            if (fbGraphRes.id === req.body.id) {
              // save new data to db
              user.name = req.body.name;
              user.facebook.id = req.body.id;
              user.facebook.token = req.body.token;
              user.save(function(err) {
                if (err) {
                  // can not save new data to db
                  console.log(err);
                }
              });
              // send token
              var token = jwt.sign({ id: user._id }, config.app.secret, {
                expiresIn: 86400 // expires in 24 hours
              });
              return res.status(200).send({ result: true, token: token });
            } else {
              return res.send({ result: false, message: 'Can not verify Facebook Access Token' });
            }
          }
          return res.send({ result: false, message: 'Can not verify Facebook Access Token' });
        }
        return res.send({ result: false, message: 'Can not verify Facebook Access Token' });
      });
    } else {
      User.create(
        {
          name: req.body.name,
          email: req.body.email,
          facebook: {
            id: req.body.id,
            token: req.body.token
          }
        },
        function(err, user) {
          if (err)
            return res.status(500).send({ result: false, message: 'There was a problem registering facebook user.' });
          // create token
          var token = jwt.sign({ id: user._id }, config.app.secret, {
            expiresIn: 86400 // expires in 24 hours
          });
          res.status(200).send({ result: true, token: token });
        }
      );
    }
  });
});
