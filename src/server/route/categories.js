const express = require('express');

const router = express.Router();
const logger = require('../helpers/logging.helper');
const Books = require('../models/Books');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

// Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, (req, res) => {
  Books.find({ enable: true }).distinct('category', (err, categories) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    return res.send({ result: true, data: categories });
  });
});

router.get('/:id', verifyApiAccessToken, (req, res) => {
  Books.find({ category: req.params.id, enable: true }, (err, books) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    return res.send({ result: true, data: books });
  });
});
