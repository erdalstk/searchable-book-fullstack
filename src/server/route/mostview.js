var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var Books = require('../models/Books');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

//Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, function(req, res) {
  var limit = parseInt(req.query.limit) || 10;
  Books.find({})
    .sort({ view_count: -1 })
    .limit(limit)
    .exec(function(err, books) {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      res.send({ result: true, data: books });
    });
});
