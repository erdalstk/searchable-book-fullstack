var express = require('express');
var router = express.Router();
var BOOKS = require('./books.json');
var fs = require('fs');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  res.json(BOOKS);
});

router.get('/:id', function(req, res) {
  var id = req.params.id;
  var result = BOOKS.books.filter(book => book.id.toString() === id);
  res.json(result);
});
