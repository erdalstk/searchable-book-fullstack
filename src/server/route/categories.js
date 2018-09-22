var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var Books = require('../models/Books');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

//Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, function(req, res) {
  Books.find({ enable: true }).distinct('category', function(err, categories) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send({ result: true, data: categories });
  });
});

router.get('/:id', verifyApiAccessToken, function(req, res) {
  Books.find({ category: req.params.id, enable: true }, function(err, books) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send({ result: true, data: books });
  });
});
