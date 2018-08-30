var express = require('express');
var router = express.Router();
var BOOKS = require('./data/books.json');
var vietnameseUtil = require('./utils/vietnameseSlug');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  var q = req.param('q');
  const inputValue = vietnameseUtil.stringToSlug(q.trim().toLowerCase());
  const inputLength = inputValue.length;

  var results =
    inputLength === 0
      ? []
      : BOOKS.books
          .filter(book =>
            vietnameseUtil
              .stringToSlug(book.name.toLowerCase())
              .includes(inputValue)
          )
          .slice(0, 10);
  res.json(results);
});
