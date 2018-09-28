const express = require('express');

const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const logger = require('../helpers/logging.helper');
const Books = require('../models/Books');
const vietnameseUtil = require('../helpers/vietnameseSlug');
const constants = require('../config/constants');
const verifyApiAccessToken = require('../helpers/verifyApiAccessToken');
const verifyAuthToken = require('../helpers/verifyAuthToken');

module.exports = router;

/**
 * GET /api/books/_id
 * */
router.get('/:id', verifyApiAccessToken, (req, res) => {
  if (!req.params || !req.params.id) return res.send({ result: false, message: 'Can not find book' });
  return Books.findOne({ _id: req.params.id, enable: true }, (err, book) => {
    if (err) {
      logger.log('info', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Can not find book' });
    }
    if (!book) {
      return res.send({ result: false, message: 'Can not find book' });
    }
    let viewCount = book.view_count;
    if (!viewCount) {
      viewCount = 0;
    }
    const updateBook = book;
    updateBook.view_count = viewCount + 1;
    const resBook = JSON.parse(JSON.stringify(updateBook));
    updateBook.save().catch(() => {
      logger.log('error', '[%s] Can not update view_count for: %s', req.originalUrl, updateBook);
    });
    if (resBook.epubLink) {
      resBook.epubLink = true;
    }
    if (resBook.mobiLink) {
      resBook.mobiLink = true;
    }
    if (resBook.pdfLink) {
      resBook.pdfLink = true;
    }
    return res.send({ result: true, data: resBook });
  });
});

/**
 * POST /api/books
 * */
const storage = multer.diskStorage({
  destination: constants.STATIC_UPLOAD_PATH,
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${vietnameseUtil.starndardUploadName(file.originalname.trim().toLowerCase())}`
    );
  }
});
const fileLimit = {
  fileSize: 5242880 // 5MB
};
function fileFilter(req, file, cb) {
  if (
    file.mimetype !== 'image/png'
    && file.mimetype !== 'image/jpg'
    && file.mimetype !== 'image/jpeg'
    && file.mimetype !== 'application/epub+zip'
    && file.mimetype !== 'application/x-mobipocket-ebook' // mobi?
    && file.mimetype !== 'pocketMobi*' // mobi?
    && file.mimetype !== 'application/octet-stream' // mobi?
    && file.mimetype !== 'application/pdf'
  ) {
    req.fileValidationError = `wrong file format:${file.mimetype}`;
    logger.log('info', '[%s] Upload Error, wrong file type: %s', req.originalUrl, file.mimetype);
    cb(new Error(req.fileValidationError));
  }
  cb(null, true);
}
const upload = multer({ storage, fileFilter, limits: fileLimit }).fields([
  { name: 'cover', maxCount: 1 },
  { name: 'epub', maxCount: 1 },
  { name: 'mobi', maxCount: 1 },
  { name: 'pdf', maxCount: 1 }
]);
router.post('/', verifyAuthToken, (req, res) => {
  // req.file is the `cover` file
  upload(req, res, async (err) => {
    if (err) {
      logger.log('error', '[%s] Upload Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: `Server error: ${err.message}` });
    }
    if (!req.body) {
      logger.log('error', '[%s] Request has no body', req.originalUrl);
      return res.status(400).send({ result: false, message: 'Request has no body' });
    }
    if (!req.body.name || !req.body.author || req.body.name === '' || req.body.author === '') {
      return res.send({ result: false, message: 'Name and author must not empty' });
    }
    let cover = '';
    let epubLink = '';
    let mobiLink = '';
    let pdfLink = '';
    // begin: resize and compress cover image
    if (req.files.cover) {
      try {
        const imgDest = `optimized-${req.files.cover[0].filename}`;
        await sharp(req.files.cover[0].path)
          .resize(250)
          .jpeg({ quality: 80, force: false })
          .png({ compressionLevel: 9, force: false })
          .toFile(constants.STATIC_UPLOAD_PATH + imgDest);
        cover = imgDest;
      } catch (err1) {
        logger.log('error', '[%s] Compress image error: %s', req.originalUrl, err1.message);
        cover = req.files.cover[0].filename;
      }
    }
    // end: resize and compress cover image
    if (req.files.epub) epubLink = req.files.epub[0].filename;
    if (req.files.mobi) mobiLink = req.files.mobi[0].filename;
    if (req.files.pdf) pdfLink = req.files.pdf[0].filename;

    if (req.body._id) {
      const updateBook = {
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
      if (epubLink !== '') {
        updateBook.epubLink = epubLink;
      }
      if (mobiLink !== '') {
        updateBook.mobiLink = mobiLink;
      }
      if (pdfLink !== '') {
        updateBook.pdfLink = pdfLink;
      }
      try {
        const book = await Books.findOneAndUpdate({ _id: req.body._id, enable: true }, updateBook);
        return res.send({ result: true, data: book });
      } catch (err1) {
        logger.log('info', '[%s] DB Error: %s', req.originalUrl, err1.message);
        return res.status(500).send({ result: false, message: 'Can not find book' });
      }
    } else {
      const book = new Books({
        name: req.body.name,
        author: req.body.author,
        category: req.body.category || '',
        description: req.body.description || '',
        cover,
        normalized_name: vietnameseUtil.stringToSlug(req.body.name.trim().toLowerCase()),
        epubLink,
        mobiLink,
        pdfLink,
        enable: true,
        create_by: req.userEmail,
        update_by: req.userEmail,
        create_time: new Date(),
        update_time: new Date()
      });
      return book
        .save()
        .then(() => res.send({ result: true, data: book }))
        .catch((err1) => {
          logger.log('error', '[%s] DB Error: %s', req.originalUrl, err1.message);
          return res.send({ result: false, message: 'Server Error' });
        });
    }
  });
});

router.get('/:email/uploaded', verifyAuthToken, (req, res) => {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  return Books.find({ create_by: req.params.email, enable: true }, (err, books) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    return res.send({ result: true, data: books });
  });
});
