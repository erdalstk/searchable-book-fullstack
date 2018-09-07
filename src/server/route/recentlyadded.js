var express = require('express');
var router = express.Router();
var Books = require('../models/Books');

//Routes will go here
module.exports = router;

router.get('/', function(req, res) {
  Books.find({})
    .sort({ update_time: -1 })
    .limit(10)
    .exec(function(err, books) {
      res.send(books);
    });
});
