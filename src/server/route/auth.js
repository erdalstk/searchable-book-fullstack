var express = require('express');
var config = require('../config/main');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
var User = require('../models/User');
var verifyToken = require('../utils/verifyToken');

module.exports = router;

router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

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
  if (!req.body || !req.body.email || !req.body.password) return res.status(401).send({ auth: false, token: null });
  User.findOne({ email: req.body.email }, function(err, user) {
    if (err) return res.status(500).send({ result: false, message: 'Error on the server' });
    if (!user) return res.send({ result: false, message: 'User not found' });
    var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);

    if (!passwordIsValid) return res.status(401).send({ auth: false, message: 'Incorrect password', token: null });
    var token = jwt.sign({ id: user._id }, config.app.secret, {
      expiresIn: 86400 // expires in 24 hours
    });
    res.status(200).send({ auth: true, token: token });
  });
});

router.get('/logout', function(req, res) {
  res.status(200).send({ result: true, token: null });
});

router.get('/me', verifyToken, function(req, res) {
  User.findById(req.userId, { password: 0 }, function(err, user) {
    if (err) return res.status(500).send('There was a problem finding the user.');
    if (!user) return res.status(404).send('No user found.');
    res.status(200).send(user);
  });
});
