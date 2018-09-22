var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var vietnameseUtil = require('../helpers/vietnameseSlug');
var Books = require('../models/Books');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

//Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, function(req, res) {
  var q = req.query.q;
  const inputValue = vietnameseUtil.stringToSlug(q.trim().toLowerCase());
  if (!inputValue || !/\S/.test(inputValue)) {
    return res.send({ result: true, data: [] });
  }
  Books.find({ normalized_name: new RegExp(inputValue, 'i'), enable: true }, function(err, books) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    res.send({ result: true, data: books });
  });
});
