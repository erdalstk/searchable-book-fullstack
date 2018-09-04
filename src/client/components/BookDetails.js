import React from 'react';
import sanitizeHtml from 'sanitize-html';
import { STATIC_IMAGE_URL } from '../config/Constants';
import { connect } from 'react-redux';
import { fetchBookDetailsCompleted } from '../actions/index';
import './BookDetails.css';

class BookDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('/api/books/' + this.props.match.params.id)
      .then(res => res.json())
      .then(book => this.props.dispatch(fetchBookDetailsCompleted(book)))
      .catch(function() {});
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      fetch('/api/books/' + this.props.match.params.id)
        .then(res => res.json())
        .then(book => this.props.dispatch(fetchBookDetailsCompleted(book)))
        .catch(function() {});
    }
  }

  render() {
    const book = this.props.book;
    if (!book) return '';
    if (!book.cover) return '';
    const clean = sanitizeHtml(book.description);
    var download_epub_link = '';
    var download_mobi_link = '';
    var download_pdf_link = '';
    if (book.epub_link) {
      download_epub_link = (
        <a href={book.epub_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          EPUB
          <br />
        </a>
      );
    }
    if (book.mobi_link) {
      download_mobi_link = (
        <a href={book.mobi_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          MOBI
          <br />
        </a>
      );
    }
    if (book.pdf_link) {
      download_pdf_link = (
        <a href={book.pdf_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          PDF
          <br />
        </a>
      );
    }
    return (
      <div className="book-details-content">
        <div className="row">
          <div className="col-sm-3 col-lg-3 col-xs-5 book-cover">
            <img src={STATIC_IMAGE_URL + book.cover} alt={book.name} className="img-thumbnail" />
          </div>
          <div className="col-sm-9 col-lg-9 book-meta">
            <h3>{book.name}</h3>
            <p>
              Tác giả:{' '}
              <button type="button" className="btn btn-light btn-xs">
                {book.author}
              </button>
            </p>
            <button type="button" className="btn btn-light btn-xs">
              #{book.category}
            </button>
            <hr />
            {/* <p>{book.description}</p> */}
            <div dangerouslySetInnerHTML={{ __html: clean }} />
            <hr />
            <h5>Download: </h5>
            <div className="btn-group" role="group">
              {download_epub_link}
              {download_mobi_link}
              {download_pdf_link}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  book: state.bookDetails
});

export default connect(mapStateToProps)(BookDetails);
