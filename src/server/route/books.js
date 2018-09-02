var express = require('express');
var router = express.Router();
var fs = require('fs');
var Books = require('../models/Books');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  Books.find({}, function(err, books) {
    res.send(books);
  });
});

router.get('/:id', function(req, res) {
  Books.findOne({ id: req.params.id }, function(err, book) {
    res.send(book);
  });
});
