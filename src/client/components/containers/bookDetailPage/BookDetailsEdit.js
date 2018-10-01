import React, { Component } from 'react';
import { imageConstants, toastOptions } from 'src/client/config';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import { bookActions } from 'src/client/actions';
import { bookService } from 'src/client/services';
import './BookDetailsEdit.css';
import { toast } from 'react-toastify';
import Dropzone from 'react-dropzone';
// BEGIN import for froala-editor
import 'src/../node_modules/froala-editor/js/froala_editor.pkgd.min';
import 'src/../node_modules/froala-editor/css/froala_style.min.css';
import 'src/../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'; // eslint-disable-line import/no-extraneous-dependencies
// END: import for froala-editor
import 'whatwg-fetch';

window.$ = $;
window.jQuery = $;

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
    this.onEpubDrop = this.onEpubDrop.bind(this);
    this.onMobiDrop = this.onMobiDrop.bind(this);
    this.onPdfDrop = this.onPdfDrop.bind(this);
    this.formSubmit = this.formSubmit.bind(this);
  }

  componentDidMount() {
    this.fetchBookDetails();
  }

  componentDidUpdate(prevProps) {
    const mainProps = this.props;
    if (mainProps.match.params.id !== prevProps.match.params.id) {
      this.fetchBookDetails();
    }
  }

  onTextInputChange(event) {
    const mainProps = this.props;
    mainProps.book[event.target.name] = event.target.value;
  }

  onCoverDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', toastOptions.ERROR);
      return;
    }
    this.setState({
      coverFile: files.slice(0, 1)
    });
  }

  onEpubDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', toastOptions.ERROR);
      return;
    }
    this.setState({
      epubFile: files.slice(0, 1)
    });
  }

  onMobiDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', toastOptions.ERROR);
      return;
    }
    this.setState({
      mobiFile: files.slice(0, 1)
    });
  }

  onPdfDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('❌ File size must below 5MB', toastOptions.ERROR);
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

  handleDescriptionEditorChange = (descriptionEditor) => {
    this.setState({
      descriptionEditor
    });
  };

  fetchBookDetails() {
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
            this.setState({
              canEdit: true,
              descriptionEditor: res.data.description
            });
          }
        }
      },
      () => {
        mainProps.dispatch(bookActions.fetchBookDetailsCompleted({}));
      }
    );
  }

  formSubmit(e) {
    e.preventDefault();
    const mainProps = this.props;
    const mainState = this.state;
    const data = new FormData();
    data.append('_id', mainProps.book._id);
    data.append('name', mainProps.book.name);
    data.append('author', mainProps.book.author);
    data.append('category', mainProps.book.category);
    data.append('description', mainState.descriptionEditor);
    if (mainState.coverFile.length) {
      data.append('cover', mainState.coverFile[0]);
    }
    if (mainState.epubFile.length) {
      data.append('epub', mainState.epubFile[0]);
    }
    if (mainState.mobiFile.length) {
      data.append('mobi', mainState.mobiFile[0]);
    }
    if (mainState.pdfFile.length) {
      data.append('pdf', mainState.pdfFile[0]);
    }

    bookService.uploadBook(data).then(
      (res) => {
        toast('✅ Success!', toastOptions.INFO);
        mainProps.history.push(`/books/${res.data._id}`);
      },
      (error) => {
        toast(`❌ ${error}`, toastOptions.ERROR);
      }
    );
  }

  render() {
    const mainState = this.state;
    const mainProps = this.props;
    if (!mainProps.book || !mainProps.book.name) return 'No book found';
    let imagePreview = mainProps.book.cover ? (
      <img
        src={imageConstants.STATIC_IMAGE_URL + mainProps.book.cover}
        alt={mainProps.book.name}
        className="img-thumbnail"
      />
    ) : (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop cover image here
      </p>
    );
    let epubPreview = mainProps.book.epub_link ? (
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
    let mobiPreview = mainProps.book.mobi_link ? (
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
        Drop MOBI here
      </p>
    );
    let pdfPreview = mainProps.book.pdf_link ? (
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
        Drop PDF here
      </p>
    );
    if (mainState.coverFile.length) {
      imagePreview = (
        <div className="upload-image-preview">
          <img alt={mainState.coverFile[0].name} src={mainState.coverFile[0].preview} />
        </div>
      );
    }
    if (mainState.epubFile.length) {
      epubPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {mainState.epubFile[0].name}
        </p>
      );
    }
    if (mainState.mobiFile.length) {
      mobiPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {mainState.mobiFile[0].name}
        </p>
      );
    }
    if (mainState.pdfFile.length) {
      pdfPreview = (
        <p className="upload-image-dropzone-text">
          <i className="fa fa-book fa-3x" />
          <br />
          {mainState.pdfFile[0].name}
        </p>
      );
    }

    return (
      <div className="book-details-edit-container">
        <form className="edit-book-form" onSubmit={this.formSubmit}>
          {mainState.canEdit && (
            <div className="can-edit">
              <button type="button" className="btn btn-xs back-btn">
                <Link to={`/books/${mainProps.book._id}`}>
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
              <Dropzone accept="image/jpeg, image/png" onDrop={this.onCoverDrop}>
                {imagePreview}
              </Dropzone>
              <button
                type="button"
                className="reset-cover-btn btn btn-xs save-btn"
                onClick={this.onResetCoverClick.bind(this)}
              >
                <i className="fa fa-refresh fa-fw" />
                Reset cover
              </button>
            </div>
            <div className="col-12 col-sm-7 col-lg-8 col-lg-9 basic-meta">
              <div className="form-group form-group-lg">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookNameInput">Name</label>
                <input
                  className="form-control form-control-lg"
                  type="text"
                  id="bookNameInput"
                  name="name"
                  onChange={this.onTextInputChange}
                  defaultValue={mainProps.book.name}
                />
              </div>
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookAuthorInput">Author</label>
                <input
                  className="form-control"
                  type="text"
                  id="bookAuthorInput"
                  name="author"
                  onChange={this.onTextInputChange}
                  defaultValue={mainProps.book.author}
                />
              </div>
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookCategoryInput">Category</label>
                <input
                  className="form-control"
                  type="text"
                  id="bookCategoryInput"
                  name="category"
                  onChange={this.onTextInputChange}
                  defaultValue={mainProps.book.category}
                />
              </div>
            </div>
          </div>

          <hr />
          <FroalaEditor
            tag="textarea"
            config={this.froalaConfig}
            model={mainState.descriptionEditor}
            onModelChange={this.handleDescriptionEditorChange}
          />
          <hr />
          <div className="download-section">
            <h5>Download: </h5>
            <div className="row">
              <div className="col-sm-6 col-md-4 col-lg-4">
                EPUB
                <Dropzone accept="application/epub+zip" onDrop={this.onEpubDrop}>
                  {epubPreview}
                </Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
              <div className="col-sm-6 col-md-4 col-lg-4">
                MOBI
                <Dropzone onDrop={this.onMobiDrop}>{mobiPreview}</Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
              <div className="col-sm-12 col-md-4 col-lg-4">
                PDF
                <Dropzone accept="application/pdf" id="pdfDropzone" onDrop={this.onPdfDrop}>
                  {pdfPreview}
                </Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
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
