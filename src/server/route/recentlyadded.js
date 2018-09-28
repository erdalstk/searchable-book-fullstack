const express = require('express');

const router = express.Router();
const logger = require('../helpers/logging.helper');
const Books = require('../models/Books');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

// Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, (req, res) => {
  const limit = parseInt(req.query.limit, 10) || 10;
  return Books.find({ enable: true })
    .sort({ update_time: -1 })
    .limit(limit)
    .exec((err, books) => {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: books });
    });
});
