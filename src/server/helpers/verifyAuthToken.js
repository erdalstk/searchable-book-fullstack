const jwt = require('jsonwebtoken');
const logger = require('./logging.helper');
const config = require('../config/main');

function verifyAuthToken(req, res, next) {
  const token = req.headers['x-access-token'];
  if (!token) {
    logger.log('info', '[%s] No token provided', req.originalUrl);
    return res.status(403).send({ result: false, message: 'No token provided' });
  }
  return jwt.verify(token, config.app.secret, (err, decoded) => {
    if (err) {
      if (err.name === 'TokenExpiredError') {
        return res.status(401).send({
          result: false,
          message: 'The authentication session has expired. Please Login again'
        });
      }
      logger.log('info', '[%s] Failed to authenticate token: %s', req.originalUrl, err.message);
      return res
        .status(401)
        .send({ result: false, message: `Failed to authenticate token: ${err.message}` });
    }
    // if everything good, save to request for use in other routes
    req.userEmail = decoded.email;
    return next();
  });
}

module.exports = verifyAuthToken;
