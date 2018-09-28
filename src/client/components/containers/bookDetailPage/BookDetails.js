import React, { Component } from 'react';
import { imageConstants } from 'src/client/config';
import { noPictureUtil } from 'src/client/helpers';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookActions } from 'src/client/actions';
import { bookService } from 'src/client/services';
import Moment from 'react-moment';
import './BookDetails.css';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import 'whatwg-fetch';

class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: false
    };
  }

  componentDidMount() {
    this.fetchBookDetail();
  }

  componentDidUpdate(prevProps) {
    const mainProps = this.props;
    if (mainProps.match.params.id !== prevProps.match.params.id) {
      this.fetchBookDetail();
    }
  }

  fetchBookDetail() {
    const mainProps = this.props;
    bookService.getBookDetails(mainProps.match.params.id).then(
      (res) => {
        mainProps.dispatch(bookActions.fetchBookDetailsCompleted(res.data));
        if (localStorage.getItem('user')) {
          const localStorageUser = JSON.parse(localStorage.getItem('user'));
          if (
            localStorageUser.email === res.data.update_by
            || localStorageUser.email === res.data.create_by
            || localStorageUser.level <= 2
          ) {
            this.setState({ canEdit: true });
          }
        }
      },
      () => {
        mainProps.dispatch(bookActions.fetchBookDetailsCompleted({}));
      }
    );
  }

  render() {
    const mainProps = this.props;
    const { book } = mainProps;
    const { canEdit } = this.state;
    if (!book || !book.name) return 'No book found';
    let downloadEpubLink = '';
    let downloadMobiLink = '';
    let downloadPdfLink = '';
    if (book.epub_link) {
      downloadEpubLink = (
        <Link className="btn btn-info btn-sm" to={`/download/${mainProps.match.params.id}/epub`}>
          <i className="fa fa-download fa-fw" />
          EPUB
          <br />
        </Link>
      );
    }
    if (book.mobi_link) {
      downloadMobiLink = (
        <Link className="btn btn-info btn-sm" to={`/download/${mainProps.match.params.id}/mobi`}>
          <i className="fa fa-download fa-fw" />
          MOBI
          <br />
        </Link>
      );
    }
    if (book.pdf_link) {
      downloadPdfLink = (
        <Link className="btn btn-info btn-sm" to={`/download/${mainProps.match.params.id}/pdf`}>
          <i className="fa fa-download fa-fw" />
          PDF
          <br />
        </Link>
      );
    }
    return (
      <div className="book-details-container">
        <div className="row">
          <div className="col-8 col-sm-4 col-md-3 col-lg-3 book-cover">
            <img
              onError={noPictureUtil.noPictureAddDefaultSrc}
              src={imageConstants.STATIC_IMAGE_URL + book.cover}
              alt={book.name}
              className="img-thumbnail"
            />
          </div>
          <div className="col-12 col-sm-8 col-md-9 col-lg-9 book-meta">
            <div className="row">
              <div>
                <h3>{book.name}</h3>
              </div>
              <div>
                {canEdit && (
                  <div className="can-edit">
                    <Link to={`/books/${book._id}/edit`}>
                      <i className="fa fa-edit fa-fw" />
                      Edit
                    </Link>
                  </div>
                )}
              </div>
            </div>
            <div className="row">
              <div className="col-12 col-sm-12 col-lg-8 basic-meta">
                <p>
                  Tác giả:&nbsp;
                  <button type="button" className="btn btn-light btn-xs">
                    {book.author}
                  </button>
                </p>
                <p>
                  Thể loại:&nbsp;
                  <button type="button" className="btn btn-light btn-xs">
                    <Link to={`/categories/${book.category}`}>{book.category}</Link>
                  </button>
                </p>
              </div>
              <div className="col-12 col-sm-12 col-lg-4 statistic-meta">
                <div className="row">
                  <div className="view-count col-12 col-sm-12 col-lg-12">
                    <i className="fa fa-eye fa-fw" aria-hidden="true" />
                    &nbsp;
                    {book.view_count ? book.view_count : 0}
                  </div>
                  <div className="download-count col-12 col-sm-12 col-lg-12">
                    <i className="fa fa-download fa-fw" aria-hidden="true" />
                    &nbsp;
                    {book.download_count ? book.download_count : 0}
                  </div>
                  {book.update_time && (
                    <div className="update-time col-12 col-sm-12 col-lg-12">
                      <i className="fa fa-clock-o fa-fw" aria-hidden="true" />
                      &nbsp;
                      <Moment diff={book.update_time} unit="days">
                        {Date.now()}
                      </Moment>
                      &nbsp;day(s) ago
                    </div>
                  )}
                  <div className="upload-by col-12 col-sm-12 col-lg-12">
                    <i className="fa fa-user fa-fw" aria-hidden="true" />
                    &nbsp;
                    {book.update_by ? (
                      <Link to={`/profile/${book.update_by}`}>{book.update_by}</Link>
                    ) : (
                      'anonymous'
                    )}
                  </div>
                </div>
              </div>
            </div>

            <hr />
            <FroalaEditorView model={book.description} />
            <hr />
            <div className="download-section">
              <h5>Download: </h5>
              <div className="btn-group" role="group">
                {downloadEpubLink}
                {downloadMobiLink}
                {downloadPdfLink}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  book: state.bookDetails,
  user: state.user
});

export default connect(mapStateToProps)(BookDetails);
