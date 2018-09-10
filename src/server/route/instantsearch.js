var express = require('express');
var router = express.Router();
var vietnameseUtil = require('../helpers/vietnameseSlug');
var Books = require('../models/Books');
//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  var q = req.query.q;
  const inputValue = vietnameseUtil.stringToSlug(q.trim().toLowerCase());
  Books.find({ normalized_name: new RegExp(inputValue, 'i') }, function(err, books) {
    res.send(books);
  });

  // Hot fix: vietnamese character
  // Books.find({}, function(err, books) {
  //   var results =
  //     inputLength === 0
  //       ? []
  //       : books.filter(book => vietnameseUtil.stringToSlug(book.name.toLowerCase()).includes(inputValue)).slice(0, 10);
  //   res.json(results);
  // });
});
