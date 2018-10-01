const express = require('express');

const router = express.Router();
const multer = require('multer');
const sharp = require('sharp');
const logger = require('../helpers/logging.helper');
const User = require('../models/User');
const vietnameseUtil = require('../helpers/vietnameseUtil.helper');
const verifyAuthToken = require('../helpers/verifyAuthToken');
const constants = require('../config/constants');

// Routes will go here
module.exports = router;

/**
 * PUT /api/users/me
 * Get user information
 * */
router.get('/:email', verifyAuthToken, (req, res) => {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  return User.findOne({ email: req.params.email, enable: true }, { facebook: 0 }, (err, user) => {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      return res.send({ result: false, message: 'User not found' });
    }
    const resUser = JSON.parse(JSON.stringify(user));
    if (user.password) {
      resUser.hasPassword = true;
      delete resUser.password;
    }
    return res.send({ result: true, data: resUser });
  });
});

/**
 * PUT /api/users/me
 * Update user
 * */
const storage = multer.diskStorage({
  destination: constants.STATIC_UPLOAD_PATH,
  filename(req, file, cb) {
    cb(
      null,
      `${Date.now()}-${vietnameseUtil.removeUnicodeDash(file.originalname.trim().toLowerCase())}`
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
  ) {
    req.fileValidationError = `wrong file format:${file.mimetype}`;
    logger.log('info', '[%s] Upload Error, wrong file type: %s', req.originalUrl, file.mimetype);
    cb(new Error(req.fileValidationError));
  }
  cb(null, true);
}
const upload = multer({ storage, fileFilter, limits: fileLimit }).fields([
  { name: 'profile_picture', maxCount: 1 }
]);
router.put('/me', verifyAuthToken, (req, res) => {
  // req.file is the `profile_picture` file
  upload(req, res, async (err) => {
    if (err) {
      logger.log('error', '[%s] Upload Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: `Server error: ${err.message}` });
    }
    if (!req.body) {
      logger.log('error', '[%s] Request has no body', req.originalUrl);
      return res.status(400).send({ result: false, message: 'Request has no body' });
    }
    let profilePicture = '';
    // begin: resize and compress cover image
    if (req.files.profile_picture) {
      try {
        const imgDest = `optimized-${req.files.profile_picture[0].filename}`;
        await sharp(req.files.profile_picture[0].path)
          .resize(250)
          .jpeg({ quality: 80, force: false })
          .png({ compressionLevel: 9, force: false })
          .toFile(constants.STATIC_UPLOAD_PATH + imgDest);
        profilePicture = imgDest;
      } catch (err1) {
        logger.log('error', '[%s] Compress image error: %s', req.originalUrl, err1.message);
        profilePicture = req.files.profile_picture[0].filename;
      }
    }
    // end: resize and compress profile_picture image

    const updateUser = {
      update_time: new Date(),
      profile_picture: profilePicture
    };

    try {
      const user = await User.findOneAndUpdate({ email: req.userEmail, enable: true }, updateUser);
      return res.send({ result: true, data: user });
    } catch (err1) {
      logger.log('info', '[%s] DB Error: %s', req.originalUrl, err1.message);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
  });
});
