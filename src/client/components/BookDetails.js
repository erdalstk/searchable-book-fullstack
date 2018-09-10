import React from 'react';
import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from '../config';
import { noPictureAddDefaultSrc } from '../helpers';
import { connect } from 'react-redux';
import { fetchBookDetailsCompleted } from '../actions/index';
import './BookDetails.css';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import 'whatwg-fetch';

class BookDetails extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    fetch('/api/books/' + this.props.match.params.id)
      .then(res => res.json())
      .then(res => {
        this.props.dispatch(fetchBookDetailsCompleted(res));
      })
      .catch(function() {});
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      fetch('/api/books/' + this.props.match.params.id)
        .then(res => res.json())
        .then(res => {
          this.props.dispatch(fetchBookDetailsCompleted(res));
        })
        .catch(function() {});
    }
  }

  render() {
    if (this.props.result === false) return 'No book found';
    const book = this.props.book;
    if (!book) return 'No book found';
    var download_epub_link = '';
    var download_mobi_link = '';
    var download_pdf_link = '';
    if (book.epub_link) {
      if (!book.epub_link.includes('http')) {
        book.epub_link = STATIC_IMAGE_URL + book.epub_link;
      }
      download_epub_link = (
        <a href={book.epub_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          EPUB
          <br />
        </a>
      );
    }
    if (book.mobi_link) {
      if (!book.mobi_link.includes('http')) {
        book.mobi_link = STATIC_IMAGE_URL + book.mobi_link;
      }
      download_mobi_link = (
        <a href={book.mobi_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          MOBI
          <br />
        </a>
      );
    }
    if (book.pdf_link) {
      if (!book.pdf_link.includes('http')) {
        book.pdf_link = STATIC_IMAGE_URL + book.pdf_link;
      }
      download_pdf_link = (
        <a href={book.pdf_link} className="btn btn-info btn-sm">
          <i className="fa fa-download fa-fw" />
          PDF
          <br />
        </a>
      );
    }
    if (!book.cover || book.cover === '') {
      book.cover = NO_COVER_IMAGE;
    }
    return (
      <div className="book-details-content">
        <div className="row">
          <div className="col-xs-6 col-sm-4 col-md-3 col-lg-3 book-cover">
            <img
              onError={noPictureAddDefaultSrc}
              src={STATIC_IMAGE_URL + book.cover}
              alt={book.name}
              className="img-thumbnail"
            />
          </div>
          <div className="col-xs-6 col-sm-8 col-md-9 col-lg-9 book-meta">
            <h3>{book.name}</h3>
            <p>
              Tác giả:
              <button type="button" className="btn btn-light btn-xs">
                {book.author}
              </button>
            </p>
            <button type="button" className="btn btn-light btn-xs">
              #{book.category}
            </button>
            <hr />
            <FroalaEditorView model={book.description} />
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
  result: state.bookDetails.result,
  book: state.bookDetails.book
});

export default connect(mapStateToProps)(BookDetails);
