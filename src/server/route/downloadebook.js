var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var Books = require('../models/Books');
var constants = require('../config/constants');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

//Routes will go here
module.exports = router;

router.get('/:id/:type', verifyApiAccessToken, function(req, res) {
  if (!req.params.id || !req.params.type || req.params.id === '' || req.params.type === '') {
    return res.status(400).send({ result: false, message: 'Bad request' });
  }
  Books.findOne({ _id: req.params.id }, function(err, book) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!book) {
      return res.send({ result: false, message: 'No book found' });
    }
    var link = '';
    switch (req.params.type) {
      case 'epub':
        if (book.epub_link) {
          link = book.epub_link;
        }
        break;
      case 'mobi':
        if (book.mobi_link) {
          link = book.mobi_link;
        }
        break;
      case 'pdf':
        if (book.pdf_link) {
          link = book.pdf_link;
        }
        break;
      default:
        return res.send({ result: false, message: 'Not available type' });
    }
    if (link === '') {
      return res.send({ result: false, message: 'Not available type' });
    }
    if (!link.includes('http')) {
      link = constants.STATIC_UPLOAD_URI_PREFIX + link;
    }
    // update download count
    var downloadCount = book.download_count;
    if (!downloadCount) {
      downloadCount = 0;
    }
    book.download_count = downloadCount + 1;
    book
      .save()
      .then(result => {})
      .catch(function() {
        logger.log('error', '[%s] Can not update download_count for: %s', req.originalUrl, book);
      });
    return res.send({ result: true, data: link });
  });
});
