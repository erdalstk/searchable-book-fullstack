const express = require('express');

const router = express.Router();
const logger = require('../helpers/logging.helper');
const Books = require('../models/Books');
const constants = require('../config/constants');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');

// Routes will go here
module.exports = router;

router.get('/:id/:type', verifyApiAccessToken, (req, res) => {
  if (!req.params.id || !req.params.type || req.params.id === '' || req.params.type === '') {
    return res.status(400).send({ result: false, message: 'Bad request' });
  }
  return Books.findOne({ _id: req.params.id, enable: true }, (err, book) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!book) {
      return res.send({ result: false, message: 'No book found' });
    }
    let link = '';
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
    let downloadCount = book.download_count;
    if (!downloadCount) {
      downloadCount = 0;
    }
    const updateBook = book;
    updateBook.download_count = downloadCount + 1;
    book.save().catch(() => {
      logger.log(
        'error',
        '[%s] Can not update download_count for: %s',
        req.originalUrl,
        updateBook
      );
    });
    return res.send({ result: true, data: link });
  });
});
