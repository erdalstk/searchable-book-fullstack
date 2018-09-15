var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var Books = require('../models/Books');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  Books.find().distinct('category', function(err, categories) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send(categories);
  });
});

router.get('/:id', function(req, res) {
  Books.find({ category: req.params.id }, function(err, book) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send(book);
  });
});
