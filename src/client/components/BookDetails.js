import React, { Component } from 'react';
import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from '../config';
import { noPictureAddDefaultSrc } from '../helpers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookDetailsCompleted, userActions } from '../actions';
import { bookService } from '../services';
import Moment from 'react-moment';
import './BookDetails.css';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import 'whatwg-fetch';

class BookDetails extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    bookService.getBookDetails(this.props.match.params.id).then(
      res => {
        this.props.dispatch(fetchBookDetailsCompleted(res.data));
      },
      error => {
        return;
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      bookService.getBookDetails(this.props.match.params.id).then(
        res => {
          this.props.dispatch(fetchBookDetailsCompleted(res.data));
        },
        error => {
          return;
        }
      );
    }
  }

  render() {
    const book = this.props.book;
    if (!book || !book.name) return 'No book found';
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
              <div className="col-12 col-sm-12 col-lg-8 basic-meta">
                <p>
                  Tác giả:
                  <button type="button" className="btn btn-light btn-xs">
                    #{book.author}
                  </button>
                </p>
                <p>
                  Thể loại:
                  <button type="button" className="btn btn-light btn-xs">
                    <Link to={'/categories/' + book.category}>#{book.category}</Link>
                  </button>
                </p>
              </div>
              <div className="col-12 col-sm-12 col-lg-4 statistic-meta">
                <div className="row">
                  <div className="view-count col-3 col-sm-12 col-lg-12">
                    <i className="fa fa-eye fa-fw" aria-hidden="true" />
                    View: {book.view_count ? book.view_count : 0}
                  </div>
                  <div className="download-count col-3 col-sm-12 col-lg-12">
                    <i className="fa fa-download fa-fw" aria-hidden="true" />
                    Download: {book.download_count ? book.download_count : 0}
                  </div>
                  {book.update_time && (
                    <div className="update-time col-3 col-sm-12 col-lg-12">
                      <i className="fa fa-clock-o fa-fw" aria-hidden="true" />
                      Updated:&nbsp;
                      <Moment diff={book.update_time} unit="days">
                        {Date.now()}
                      </Moment>
                      &nbsp;day(s) ago
                    </div>
                  )}
                  <div className="upload-by col-3 col-sm-12 col-lg-12">
                    <i className="fa fa-user fa-fw" aria-hidden="true" />
                    Upload by:&nbsp;
                    {book.create_by ? <Link to={'/profile/' + book.create_by}>{book.create_by}</Link> : 'anonymous'}
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
  book: state.bookDetails
});

export default connect(mapStateToProps)(BookDetails);
