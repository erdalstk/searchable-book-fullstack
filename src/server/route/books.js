var express = require('express');
var router = express.Router();
var logger = require('../helpers/loggingHelper');
var Books = require('../models/Books');
var multer = require('multer');
var vietnameseUtil = require('../helpers/vietnameseSlug');

module.exports = router;

/**
 * GET /api/books
 **/
router.get('/', function(req, res) {
  Books.find({}, function(err, books) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    return res.send(books);
  });
});

/**
 * GET /api/books/_id
 **/
router.get('/:id', function(req, res) {
  if (!req.params || !req.params.id) return res.send({ result: false, message: 'Can not find book' });
  Books.findOne({ _id: req.params.id }, function(err, book) {
    if (err) {
      logger.log('info', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Can not find book' });
    }
    if (book) {
      var viewCount = book.view_count;
      if (!viewCount || viewCount === '') {
        viewCount = '0';
      }
      viewCount = parseInt(viewCount);
      viewCount = viewCount + 1;
      book.view_count = viewCount.toString();
      book
        .save()
        .then(result => {})
        .catch(function() {
          logger.log('error', '[%s] Can not update view_count for: %s', req.originalUrl, book);
        });
      return res.send({ result: true, book: book });
    }
    return res.send({ result: false, message: 'Can not find book' });
  });
});

/**
 * POST /api/books
 **/
var storage = multer.diskStorage({
  destination: './static/upload',
  filename: function(req, file, cb) {
    cb(null, Date.now() + '-' + vietnameseUtil.starndardUploadName(file.originalname.trim().toLowerCase()));
  }
});
const fileLimit = {
  fileSize: 5242880 // 5MB
};
function fileFilter(req, file, cb) {
  if (
    file.mimetype !== 'image/png' &&
    file.mimetype !== 'image/jpg' &&
    file.mimetype !== 'image/jpeg' &&
    file.mimetype !== 'image/gif' &&
    file.mimetype !== 'application/epub+zip' &&
    file.mimetype !== 'application/x-mobipocket-ebook' && // mobi?
    file.mimetype !== 'pocketMobi*' && // mobi?
    file.mimetype !== 'application/octet-stream' && // mobi?
    file.mimetype !== 'application/pdf'
  ) {
    req.fileValidationError = 'goes wrong on the mimetype';
    cb(new Error('goes wrong on the mimetype'));
  }
  cb(null, true);
}
var upload = multer({ storage: storage, fileFilter: fileFilter, limits: fileLimit }).fields([
  { name: 'cover', maxCount: 1 },
  { name: 'epub', maxCount: 1 },
  { name: 'mobi', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);
router.post('/', function(req, res) {
  // req.file is the `cover` file
  upload(req, res, function(err) {
    if (err) {
      logger.log('error', '[%s] Upload Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error: ' + err.message });
    }
    if (!req.body) {
      logger.log('error', '[%s] Request has no body', req.originalUrl);
      return res.status(400).send({ result: false, message: 'Request has no body' });
    }
    if (!req.body.name || !req.body.author || req.body.name === '' || req.body.author === '') {
      return res.send({ result: false, message: 'Name and author must not empty' });
    }
    var cover = '';
    var epub_link = '';
    var mobi_link = '';
    var pdf_link = '';
    if (req.files['cover']) cover = req.files['cover'][0].filename;
    if (req.files['epub']) epub_link = req.files['epub'][0].filename;
    if (req.files['mobi']) mobi_link = req.files['mobi'][0].filename;
    if (req.files['pdf']) pdf_link = req.files['pdf'][0].filename;
    var book = new Books({
      name: req.body.name,
      author: req.body.author,
      category: req.body.category || '',
      description: req.body.description || '',
      cover: cover,
      normalized_name: vietnameseUtil.stringToSlug(req.body.name.trim().toLowerCase()),
      epub_link: epub_link,
      mobi_link: mobi_link,
      pdf_link: pdf_link,
      create_time: new Date(),
      update_time: new Date()
    });
    book
      .save()
      .then(result => {
        res.send({ result: true, book: book });
      })
      .catch(function(err) {
        logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
        res.send({ result: false, message: 'Server Error' });
      });
  });
});
