import React, { Component } from 'react';
import { STATIC_IMAGE_URL } from 'src/client/config';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchBookDetailsCompleted } from 'src/client/actions';
import { bookService } from 'src/client/services';
import './BookDetailsEdit.css';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';
import Dropzone from 'react-dropzone';
// BEGIN import for froala-editor
import 'src/../node_modules/froala-editor/js/froala_editor.pkgd.min.js';
import 'src/../node_modules/froala-editor/css/froala_style.min.css';
import 'src/../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;
// END: import for froala-editor
import 'whatwg-fetch';

class BookDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      canEdit: false,
      descriptionEditor: '',
      coverFile: [],
      epubFile: [],
      mobiFile: [],
      pdfFile: []
    };
    this.maxFileSize = 5242880;
    this.froalaConfig = {
      placeholderText: 'Edit book description...',
      imageUpload: false,
      toolbarButtons: [
        'bold',
        'italic',
        'fontFamily',
        'fontSize',
        'color',
        'formatUL',
        'formatOL',
        '|',
        'insertLink',
        'insertImage',
        '|',
        'emoticons'
      ]
    };
    this.handleDescriptionEditorChange = this.handleDescriptionEditorChange.bind(this);
    this.onTextInputChange = this.onTextInputChange.bind(this);
    this.onCoverDrop = this.onCoverDrop.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  fetchBookDetails() {
    bookService.getBookDetails(this.props.match.params.id).then(
      res => {
        this.props.dispatch(fetchBookDetailsCompleted(res.data));
        if (localStorage.getItem('user')) {
          var localStorageUser = JSON.parse(localStorage.getItem('user'));
          if (
            localStorageUser.email === res.data.update_by ||
            localStorageUser.email === res.data.create_by ||
            localStorageUser.level <= 2
          ) {
            this.setState({
              canEdit: true,
              descriptionEditor: res.data.description
            });
          }
        }
      },
      error => {
        this.props.dispatch(fetchBookDetailsCompleted({}));
        return;
      }
    );
  }

  componentDidMount() {
    this.fetchBookDetails();
  }

  componentDidUpdate(prevProps) {
    if (this.props.match.params.id !== prevProps.match.params.id) {
      this.fetchBookDetails();
    }
  }

  onTextInputChange(event) {
    const { book } = this.props;
    book[event.target.name] = event.target.value;
  }

  handleDescriptionEditorChange = descriptionEditor => {
    this.setState({
      descriptionEditor: descriptionEditor
    });
  };

  onCoverDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      coverFile: files.slice(0, 1)
    });
  }

  onEpubDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      epubFile: files.slice(0, 1)
    });
  }
  onMobiDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      mobiFile: files.slice(0, 1)
    });
  }
  onPdfDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      pdfFile: files.slice(0, 1)
    });
  }

  onResetCoverClick(e) {
    e.preventDefault();
    this.setState({
      coverFile: []
    });
  }

  formSubmit(e) {
    e.preventDefault();
    var { book } = this.props;
    var historyProps = this.props.history;
    var data = new FormData();
    data.append('_id', book._id);
    data.append('name', book.name);
    data.append('author', book.author);
    data.append('category', book.category);
    data.append('description', this.state.descriptionEditor);
    if (this.state.coverFile.length) {
      data.append('cover', this.state.coverFile[0]);
    }
    if (this.state.epubFile.length) {
      data.append('epub', this.state.epubFile[0]);
    }
    if (this.state.mobiFile.length) {
      data.append('mobi', this.state.mobiFile[0]);
    }
    if (this.state.pdfFile.length) {
      data.append('pdf', this.state.pdfFile[0]);
    }

    bookService.uploadBook(data).then(
      res => {
        toast('✅ Success!', infoToastOptions);
        historyProps.push('/books/' + res.data._id);
        return;
      },
      error => {
        toast('❌ ' + error, errorToastOptions);
        return;
      }
    );
  }

  render() {
    const book = this.props.book;
    if (!book || !book.name) return 'No book found';
    var imagePreview = book.cover ? (
      <img src={STATIC_IMAGE_URL + book.cover} alt={book.name} className="img-thumbnail" />
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop cover image here
      </p>
    );
    var epubPreview = book.epub_link ? (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-book fa-3x" />
        <br />
        Already have file, click or drop here to change file
      </p>
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop EPUB here
      </p>
    );
    var mobiPreview = book.mobi_link ? (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-book fa-3x" />
        <br />
        Already have file, click or drop here to change file
      </p>
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop EPUB here
      </p>
    );
    var pdfPreview = book.pdf_link ? (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-book fa-3x" />
        <br />
        Already have file, click or drop here to change file
      </p>
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop EPUB here
      </p>
    );
    if (this.state.coverFile.length) {
      imagePreview = (
        <div className="upload-image-preview">
          <img alt={this.state.coverFile[0].name} src={this.state.coverFile[0].preview} />
        </div>
      );
    }
    if (this.state.epubFile.length) {
      epubPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {this.state.epubFile[0].name}
        </p>
      );
    }
    if (this.state.mobiFile.length) {
      mobiPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {this.state.mobiFile[0].name}
        </p>
      );
    }
    if (this.state.pdfFile.length) {
      pdfPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {this.state.pdfFile[0].name}
        </p>
      );
    }

    return (
      <div className="book-details-edit-container">
        <form className="edit-book-form" onSubmit={this.formSubmit}>
          {this.state.canEdit && (
            <div className="can-edit">
              <button type="button" className="btn btn-xs back-btn">
                <Link to={'/books/' + book._id}>
                  <i className="fa fa-arrow-left fa-fw" />
                  Back
                </Link>
              </button>
              <button type="submit" className="btn btn-xs save-btn">
                <i className="fa fa-save fa-fw" />
                Save
              </button>
            </div>
          )}
          <br />
          <br />
          <div className="row">
            <div className="col-12 col-sm-5 col-md-4 col-lg-3 book-cover">
              <Dropzone accept="image/jpeg, image/png" onDrop={this.onCoverDrop.bind(this)}>
                {imagePreview}
              </Dropzone>
              <button className="reset-cover-btn btn btn-xs save-btn" onClick={this.onResetCoverClick.bind(this)}>
                <i className="fa fa-refresh fa-fw" />
                Reset cover
              </button>
            </div>
            <div className="col-12 col-sm-7 col-lg-8 col-lg-9 basic-meta">
              <div className="form-group form-group-lg">
                <label htmlFor="bookNameInput">Name</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  id="bookNameInput"
                  name="name"
                  onChange={this.onTextInputChange}
                  defaultValue={book.name}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bookAuthorInput">Author</label>
                <input
                  className="form-control"
                  type="text"
                  id="bookAuthorInput"
                  name="author"
                  onChange={this.onTextInputChange}
                  defaultValue={book.author}
                />
              </div>
              <div className="form-group">
                <label htmlFor="bookCategoryInput">Category</label>
                <input
                  className="form-control"
                  type="text"
                  id="bookCategoryInput"
                  name="category"
                  onChange={this.onTextInputChange}
                  defaultValue={book.category}
                />
              </div>
            </div>
          </div>

          <hr />
          <FroalaEditor
            tag="textarea"
            config={this.froalaConfig}
            model={this.state.descriptionEditor}
            onModelChange={this.handleDescriptionEditorChange}
          />
          <hr />
          <div className="download-section">
            <h5>Download: </h5>
            <div className="row">
              <div className="col-sm-6 col-md-4 col-lg-4">
                <div className="form-group">
                  <label>EPUB</label>
                  <Dropzone accept="application/epub+zip" onDrop={this.onEpubDrop.bind(this)}>
                    {epubPreview}
                  </Dropzone>
                  <small id="fileSizeHelp" className="form-text text-muted">
                    File size below 5MB
                  </small>
                </div>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-4">
                <div className="form-group">
                  <label>MOBI</label>
                  <Dropzone onDrop={this.onMobiDrop.bind(this)}>{mobiPreview}</Dropzone>
                  <small id="fileSizeHelp" className="form-text text-muted">
                    File size below 5MB
                  </small>
                </div>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4">
                <div className="form-group">
                  <label>PDF</label>
                  <Dropzone accept="application/pdf" onDrop={this.onPdfDrop.bind(this)}>
                    {pdfPreview}
                  </Dropzone>
                  <small id="fileSizeHelp" className="form-text text-muted">
                    File size below 5MB
                  </small>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  book: state.bookDetails,
  user: state.user
});

export default connect(mapStateToProps)(BookDetails);
