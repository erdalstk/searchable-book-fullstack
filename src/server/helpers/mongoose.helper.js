const mongoose = require('mongoose');
const logger = require('./logging.helper');

// configurations
const config = require('../config/main');
const {
  db: { host, port, name, username, password }
} = config;

// connect to mongodb
var retryInterval = 10000;
var mongooseOptions = {
  useNewUrlParser: true,
  reconnectTries: Number.MAX_VALUE,
  reconnectInterval: retryInterval
};
const dbConnectionString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);

mongoose.connection.once('open', function() {
  mongoose.connection.on('connected', function() {
    logger.log('info', 'Mongo connected');
  });
  mongoose.connection.on('disconnected', function() {
    logger.log('warn', 'Mongo disconnected');
  });
  mongoose.connection.on('reconnected', function() {
    logger.log('info', 'Mongo reconnected');
  });
  mongoose.connection.on('error', function(err) {
    logger.log('error', 'Mongo event error ' + err);
  });
});

var connectMongoWithRetry = function() {
  return mongoose
    .connect(
      dbConnectionString,
      mongooseOptions
    )
    .then(() => {
      logger.log('info', 'Successfully connect to mongo on startup: %s', dbConnectionString);
    })
    .catch(err => {
      logger.log(
        'error',
        'Failed to connect to mongo on startup - retrying in %d sec. Connection string: %s',
        retryInterval / 1000,
        dbConnectionString
      );
      setTimeout(connectMongoWithRetry, retryInterval);
      if (retryInterval < 300000) {
        retryInterval += 10000;
      }
    });
};

module.exports = connectMongoWithRetry;
