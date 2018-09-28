const logger = require('./logging.helper');
const constants = require('../config/constants');

function verifyApiAccessToken(req, res, next) {
  const token = req.headers['api-access-token'];
  if (!token) {
    logger.log('info', '[%s] No api access token provided', req.originalUrl);
    return res.status(403).send({ result: false, message: 'No api access token provided' });
  }

  if (
    token === constants.API_ACCESS_TOKEN.WEB_APP
    || token === constants.API_ACCESS_TOKEN.BOT_APP
  ) {
    return next();
  }

  return res.status(403).send({ result: false, message: 'Api access token incorrect' });
}

module.exports = verifyApiAccessToken;
