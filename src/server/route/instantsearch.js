var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var vietnameseUtil = require('../helpers/vietnameseSlug');
var Books = require('../models/Books');
//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  var q = req.query.q;
  const inputValue = vietnameseUtil.stringToSlug(q.trim().toLowerCase());
  Books.find({ normalized_name: new RegExp(inputValue, 'i') }, function(err, books) {
    if (err) {
      logger.log('error', 'DB Error: ' + err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send(books);
  });
});
