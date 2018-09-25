var express = require('express');
var router = express.Router();
var logger = require('../helpers/logging.helper');
var User = require('../models/User');
var multer = require('multer');
var sharp = require('sharp');
var vietnameseUtil = require('../helpers/vietnameseSlug');
var verifyAuthToken = require('../helpers/verifyAuthToken');
var constants = require('../config/constants');

//Routes will go here
module.exports = router;

/**
 * PUT /api/users/me
 * Get user information
 **/
router.get('/:email', verifyAuthToken, function(req, res) {
  if (!req.params || !req.params.email) {
    return res.send({ result: false, message: 'Empty param' });
  }
  if (req.params.email === 'me') {
    req.params.email = req.userEmail;
  }
  User.findOne({ email: req.params.email, enable: true }, { facebook: 0 }, function(err, user) {
    if (err) {
      logger.log('error', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error' });
    }
    if (!user) {
      return res.send({ result: false, message: 'User not found' });
    }
    let resUser = JSON.parse(JSON.stringify(user));
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
  if (file.mimetype !== 'image/png' && file.mimetype !== 'image/jpg' && file.mimetype !== 'image/jpeg') {
    req.fileValidationError = 'wrong file format:' + file.mimetype;
    logger.log('info', '[%s] Upload Error, wrong file type: %s', req.originalUrl, file.mimetype);
    cb(new Error(req.fileValidationError));
  }
  cb(null, true);
}
var upload = multer({ storage: storage, fileFilter: fileFilter, limits: fileLimit }).fields([
  { name: 'profile_picture', maxCount: 1 }
]);
router.put('/me', verifyAuthToken, function(req, res) {
  // req.file is the `profile_picture` file
  upload(req, res, async function(err) {
    if (err) {
      logger.log('error', '[%s] Upload Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Server error: ' + err.message });
    }
    if (!req.body) {
      logger.log('error', '[%s] Request has no body', req.originalUrl);
      return res.status(400).send({ result: false, message: 'Request has no body' });
    }
    var profile_picture = '';
    // begin: resize and compress cover image
    if (req.files['profile_picture']) {
      try {
        let img_dest = 'optimized-' + req.files['profile_picture'][0].filename;
        await sharp(req.files['profile_picture'][0].path)
          .resize(250)
          .jpeg({ quality: 80, force: false })
          .png({ compressionLevel: 9, force: false })
          .toFile(constants.STATIC_UPLOAD_PATH + img_dest);
        profile_picture = img_dest;
      } catch (err) {
        logger.log('error', '[%s] Compress image error: %s', req.originalUrl, err.message);
        profile_picture = req.files['profile_picture'][0].filename;
      }
    }
    // end: resize and compress profile_picture image

    var updateUser = {
      update_time: new Date(),
      profile_picture: profile_picture
    };

    try {
      user = await User.findOneAndUpdate({ email: req.userEmail, enable: true }, updateUser);
      return res.send({ result: true, data: user });
    } catch (err) {
      logger.log('info', '[%s] DB Error: %s', req.originalUrl, err.message);
      return res.status(500).send({ result: false, message: 'Can not find user' });
    }
  });
});
