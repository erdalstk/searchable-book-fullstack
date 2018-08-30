const express = require('express');
const app = express();

app.use(express.static('dist'));

var books = require('./books.js');
var instantsearch = require('./instantsearch.js');
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);

app.listen(8080, () => console.log('Listening on port 8080!'));
