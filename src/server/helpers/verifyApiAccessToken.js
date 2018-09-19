var logger = require('./logging.helper');
var constants = require('../config/constants');

function verifyApiAccessToken(req, res, next) {
  var token = req.headers['api-access-token'];
  if (!token) {
    logger.log('info', '[%s] No api access token provided', req.originalUrl);
    return res.status(403).send({ result: false, message: 'No api access token provided' });
  }
  for (var key in constants.API_ACCESS_TOKEN) {
    if (token === constants.API_ACCESS_TOKEN[key])
      // if everything good, next to router
      return next();
  }
  return res.status(403).send({ result: false, message: 'Api access token incorrect' });
}

module.exports = verifyApiAccessToken;
