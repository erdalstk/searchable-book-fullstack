import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { STATIC_IMAGE_URL } from '../config/Constants';

export default class BookDetails extends React.Component {
  constructor(props) {
    super(props);
    this.state = { book: [] };
  }

  componentDidMount() {
    fetch('/api/books/' + this.props.match.params.id)
      .then(res => res.json())
      .then(book => this.setState({ book: book }));
  }

  render() {
    const book = this.state.book;
    const clean = sanitizeHtml(book.description);
    var download_epub_link = '';
    var download_mobi_link = '';
    var download_pdf_link = '';
    if (book.epub_link) {
      download_epub_link = (
        <a href={book.epub_link}>
          Download EPUB
          <br />
        </a>
      );
    }
    if (book.mobi_link) {
      download_mobi_link = (
        <a href={book.mobi_link}>
          Download MOBI
          <br />
        </a>
      );
    }
    if (book.pdf_link) {
      download_pdf_link = (
        <a href={book.pdf_link}>
          Download PDF
          <br />
        </a>
      );
    }
    return (
      <div>
        <h3>{book.name}</h3>
        <img src={STATIC_IMAGE_URL + book.cover} alt={book.name} className="img-thumbnail" />
        <p>{book.author}</p>
        <p>{book.category}</p>
        {/* <p>{book.description}</p> */}
        <div dangerouslySetInnerHTML={{ __html: clean }} />
        {download_epub_link}
        {download_mobi_link}
        {download_pdf_link}
      </div>
    );
  }
}
