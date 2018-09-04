const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

const config = require('./config/main');
const {
  db: { host, port, name, username, password }
} = config;

app.use(express.static('dist'));
app.use('/static', express.static(path.join(__dirname, 'static')));

const dbConnectionString = `mongodb://${username}:${password}@${host}:${port}/${name}?authSource=admin`;
console.log(dbConnectionString);
mongoose.connect(
  dbConnectionString,
  { useNewUrlParser: true }
);

var books = require('./route/books.js');
var instantsearch = require('./route/instantsearch.js');
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);

app.get('*', (req, res) => {
  res.send('404 Not Found');
});

app.listen(config.app.port, () => console.log('Listening on port ' + config.app.port));
