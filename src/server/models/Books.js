var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BooksSchema = new Schema({
  id: String,
  name: String,
  normalized_name: String,
  author: String,
  category: String,
  description: String,
  cover: String,
  epub_link: String,
  mobi_link: String,
  pdf_link: String,
  view_count: String,
  download_count: String,
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('Books', BooksSchema);
