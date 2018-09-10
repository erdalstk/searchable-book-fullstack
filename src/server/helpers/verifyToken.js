var jwt = require('jsonwebtoken');
var config = require('../config/main');

function verifyToken(req, res, next) {
  var token = req.headers['x-access-token'];
  if (!token) return res.status(403).send({ result: false, message: 'No token provided.' });
  jwt.verify(token, config.app.secret, function(err, decoded) {
    if (err) return res.status(500).send({ result: false, message: 'Failed to authenticate token.' });
    // if everything good, save to request for use in other routes
    req.userId = decoded.id;
    next();
  });
}

module.exports = verifyToken;
