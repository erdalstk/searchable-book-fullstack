const express = require('express');

const router = express.Router();
const logger = require('../helpers/logging.helper');
const vietnameseUtil = require('../helpers/vietnameseUtil.helper');
const Books = require('../models/Books');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

// Routes will go here
module.exports = router;

router.get('/', verifyApiAccessToken, (req, res) => {
  const { q } = req.query;
  const inputValue = vietnameseUtil.removeUnicode(q.trim().toLowerCase());
  if (!inputValue || !/\S/.test(inputValue)) {
    return res.send({ result: true, data: [] });
  }
  return Books.find(
    { normalized_name: new RegExp(inputValue, 'i'), enable: true },
    (err, books) => {
      if (err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Server error' });
      }
      return res.send({ result: true, data: books });
    }
  );
});
