const express = require('express');
const path = require('path');
const app = express();
const mongoose = require('mongoose');

app.use(express.static('dist'));
app.use('/static', express.static(path.join(__dirname, 'static')));

mongoose.connect('mongodb://root:admin123@haoict.com:27017/mdstbooks?authSource=admin');

var books = require('./route/books.js');
var instantsearch = require('./route/instantsearch.js');
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);

app.get('*', (req, res) => {
  res.send('404 Not Found');
});

app.listen(8080, () => console.log('Listening on port 8080!'));
