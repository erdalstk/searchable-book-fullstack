var express = require('express');
var router = express.Router();
var Books = require('../models/Books');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  Books.find().distinct('category', function(err, categories) {
    res.send(categories);
  });
});

router.get('/:id', function(req, res) {
  Books.find({ category: req.params.id }, function(err, book) {
    res.send(book);
  });
});
