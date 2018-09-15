import React, { Component } from 'react';
import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from '../config';
import { noPictureAddDefaultSrc } from '../helpers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookDetailsCompleted } from '../actions/index';
import './BookDetails.css';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import 'whatwg-fetch';

class BookDetails extends Component {
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
      download_epub_link = (
        <Link className="btn btn-info btn-sm" to={'/download/' + this.props.match.params.id + '/epub'}>
          <i className="fa fa-download fa-fw" />
          EPUB
          <br />
        </Link>
      );
    }
    if (book.mobi_link) {
      download_mobi_link = (
        <Link className="btn btn-info btn-sm" to={'/download/' + this.props.match.params.id + '/mobi'}>
          <i className="fa fa-download fa-fw" />
          MOBI
          <br />
        </Link>
      );
    }
    if (book.pdf_link) {
      download_pdf_link = (
        <Link className="btn btn-info btn-sm" to={'/download/' + this.props.match.params.id + '/pdf'}>
          <i className="fa fa-download fa-fw" />
          PDF
          <br />
        </Link>
      );
    }
    return (
      <div className="book-details-content">
        <div className="row">
          <div className="col-12 col-sm-4 col-md-3 col-lg-3 book-cover">
            <img
              onError={noPictureAddDefaultSrc}
              src={STATIC_IMAGE_URL + book.cover}
              alt={book.name}
              className="img-thumbnail"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-9 col-lg-9 book-meta">
            <h3>{book.name}</h3>
            <div className="row">
              <div className="col-12 col-sm-9 col-lg-10 basic-meta">
                <p>
                  Tác giả:
                  <button type="button" className="btn btn-light btn-xs">
                    #{book.author}
                  </button>
                </p>
                <p>
                  Thể loại:
                  <button type="button" className="btn btn-light btn-xs">
                    #{book.category}
                  </button>
                </p>
              </div>
              <div className="col-12 col-sm-3 col-lg-2 statistic-meta">
                <div className="row">
                  <div className="view-count col-3 col-sm-12 col-lg-12">
                    <i className="fa fa-eye fa-fw" aria-hidden="true" />
                    {book.view_count}
                  </div>
                  <div className="download-count col-3 col-sm-12 col-lg-12">
                    <i className="fa fa-download fa-fw" aria-hidden="true" />
                    {book.download_count}
                  </div>
                </div>
              </div>
            </div>

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
