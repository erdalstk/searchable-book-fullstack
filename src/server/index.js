const express = require('express');
const app = express();
const mongoose = require('mongoose');
// configurations
const config = require('./config/main');
const {
  db: { host, port, name, username, password }
} = config;

// serve static files
app.use(express.static('dist'));
app.use("/static", express.static('static'));

// connect to mongodb
const dbConnectionString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
mongoose.connect(
  dbConnectionString,
  { useNewUrlParser: true }
);

// route
var books = require('./route/books.js');
var instantsearch = require('./route/instantsearch.js');
var categories = require('./route/categories.js');
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);
app.use('/api/categories', categories);

app.get('*', (req, res) => {
  res.send('404 Not Found');
});

// start listing
app.listen(config.app.port, () => console.log('Listening on port ' + config.app.port));
