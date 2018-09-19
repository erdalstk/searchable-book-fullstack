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
  view_count: Number,
  download_count: Number,
  create_by: String, // user email
  update_by: String, // user email
  create_time: Date,
  update_time: Date
});

module.exports = mongoose.model('Books', BooksSchema);
