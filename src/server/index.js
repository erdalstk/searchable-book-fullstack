const express = require('express');
const app = express();
const mongoose = require('mongoose');
const logger = require('./helpers/loggingHelper');
// configurations
const config = require('./config/main');
const {
  db: { host, port, name, username, password }
} = config;

// serve static files
app.use(express.static('dist'));
app.use('/static', express.static('static'));

// connect to mongodb
mongoose.set('useNewUrlParser', true);
mongoose.set('useFindAndModify', false);
mongoose.set('useCreateIndex', true);
const dbConnectionString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
mongoose.connect(
  dbConnectionString,
  { useNewUrlParser: true }
);

// route
var auth = require('./route/auth');
var books = require('./route/books.js');
var instantsearch = require('./route/instantsearch.js');
var categories = require('./route/categories.js');
var recentlyadded = require('./route/recentlyadded');
var mostview = require('./route/mostview');

app.use('/api/auth', auth);
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);
app.use('/api/categories', categories);
app.use('/api/recentlyadded', recentlyadded);
app.use('/api/mostview', mostview);

app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// start listing
app.listen(config.app.port, () => logger.log('info', 'Listening on port ' + config.app.port));
