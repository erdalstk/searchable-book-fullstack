var express = require('express');
var router = express.Router();
var logger = require('../helpers/loggingHelper');
var Books = require('../models/Books');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  Books.find({})
    .sort({ view_count: -1 })
    .limit(10)
    .exec(function(err, books) {
      res.send(books);
    });
});
