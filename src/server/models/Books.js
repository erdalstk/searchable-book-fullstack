var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BooksSchema = new Schema({
  id: String,
  name: String,
  author: String,
  category: String,
  description: String,
  cover: String,
  epub_link: String,
  mobi_link: String,
  pdf_link: String
});

module.exports = mongoose.model('Books', BooksSchema);