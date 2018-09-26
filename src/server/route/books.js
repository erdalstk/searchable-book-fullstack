var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var Books = require('../models/Books');
var multer = require('multer');
var sharp = require('sharp');
var vietnameseUtil = require('../helpers/vietnameseSlug');
var constants = require('../config/constants');
var verifyApiAccessToken = require('../helpers/verifyApiAccessToken');
var verifyAuthToken = require('../helpers/verifyAuthToken');

module.exports = router;

/**
 * GET /api/books/_id
 **/
router.get('/:id', verifyApiAccessToken, function(req, res) {
  if (!req.params || !req.params.id) return res.send({ result: false, message: 'Can not find book' });
  Books.findOne({ _id: req.params.id, enable: true }, function(err, book) {
    if (err) {
      logger.log('info', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Can not find book' });
    }
    if (!book) {
      return res.send({ result: false, message: 'Can not find book' });
    }
    var viewCount = book.view_count;
    if (!viewCount) {
      viewCount = 0;
    }
    book.view_count = viewCount + 1;
    let resBook = JSON.parse(JSON.stringify(book));
    book
      .save()
      .then(result => {})
      .catch(function() {
        logger.log('error', '[%s] Can not update view_count for: %s', req.originalUrl, book);
      });
    if (resBook.epub_link) {
      resBook.epub_link = true;
    }
    if (resBook.mobi_link) {
      resBook.mobi_link = true;
    }
    if (resBook.pdf_link) {
      resBook.pdf_link = true;
    }
    return res.send({ result: true, data: resBook });
  });
});

/**
 * POST /api/books
 **/
var storage = multer.diskStorage({
  destination: constants.STATIC_UPLOAD_PATH,
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
    file.mimetype !== 'application/epub+zip' &&
    file.mimetype !== 'application/x-mobipocket-ebook' && // mobi?
    file.mimetype !== 'pocketMobi*' && // mobi?
    file.mimetype !== 'application/octet-stream' && // mobi?
    file.mimetype !== 'application/pdf'
  ) {
    req.fileValidationError = 'wrong file format:' + file.mimetype;
    logger.log('info', '[%s] Upload Error, wrong file type: %s', req.originalUrl, file.mimetype);
    cb(new Error(req.fileValidationError));
  }
  cb(null, true);
}
var upload = multer({ storage: storage, fileFilter: fileFilter, limits: fileLimit }).fields([
  { name: 'cover', maxCount: 1 },
  { name: 'epub', maxCount: 1 },
  { name: 'mobi', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);
router.post('/', verifyAuthToken, function(req, res) {
  // req.file is the `cover` file
  upload(req, res, async function(err) {
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
    // begin: resize and compress cover image
    if (req.files['cover']) {
      try {
        let img_dest = 'optimized-' + req.files['cover'][0].filename;
        await sharp(req.files['cover'][0].path)
          .resize(250)
          .jpeg({ quality: 80, force: false })
          .png({ compressionLevel: 9, force: false })
          .toFile(constants.STATIC_UPLOAD_PATH + img_dest);
        cover = img_dest;
      } catch (err) {
        logger.log('error', '[%s] Compress image error: %s', req.originalUrl, err.message);
        cover = req.files['cover'][0].filename;
      }
    }
    // end: resize and compress cover image
    if (req.files['epub']) epub_link = req.files['epub'][0].filename;
    if (req.files['mobi']) mobi_link = req.files['mobi'][0].filename;
    if (req.files['pdf']) pdf_link = req.files['pdf'][0].filename;

    if (req.body._id) {
      var updateBook = {
        name: req.body.name,
        author: req.body.author,
        category: req.body.category,
        description: req.body.description,
        update_by: req.userEmail,
        update_time: new Date()
      };
      if (cover !== '') {
        updateBook.cover = cover;
      }
      if (epub_link !== '') {
        updateBook.epub_link = epub_link;
      }
      if (mobi_link !== '') {
        updateBook.mobi_link = mobi_link;
      }
      if (pdf_link !== '') {
        updateBook.pdf_link = pdf_link;
      }
      try {
        book = await Books.findOneAndUpdate({ _id: req.body._id, enable: true }, updateBook);
        return res.send({ result: true, data: book });
      } catch (err) {
        logger.log('info', '[%s] DB Error: %s', req.originalUrl, err.message);
        return res.status(500).send({ result: false, message: 'Can not find book' });
      }
    } else {
      book = new Books({
        name: req.body.name,
        author: req.body.author,
        category: req.body.category || '',
        description: req.body.description || '',
        cover: cover,
        normalized_name: vietnameseUtil.stringToSlug(req.body.name.trim().toLowerCase()),
        epub_link: epub_link,
        mobi_link: mobi_link,
        pdf_link: pdf_link,
        enable: true,
        create_by: req.userEmail,
        update_by: req.userEmail,
        create_time: new Date(),
        update_time: new Date()
      });
      book
        .save()
        .then(result => {
          return res.send({ result: true, data: book });
        })
        .catch(function(err) {
          logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
          return res.send({ result: false, message: 'Server Error' });
        });
    }
  });
});

router.get('/:email/uploaded', verifyAuthToken, function(req, res) {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  Books.find({ create_by: req.params.email, enable: true }, function(err, books) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    return res.send({ result: true, data: books });
  });
});
