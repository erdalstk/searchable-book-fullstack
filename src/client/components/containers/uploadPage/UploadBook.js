import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bookService } from 'src/client/services';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';
import Dropzone from 'react-dropzone';
// if use async/await import 'babel-polyfill';
import 'whatwg-fetch';
import './UploadBook.css';
// BEGIN import for froala-editor
import 'src/../node_modules/froala-editor/js/froala_editor.pkgd.min';
import 'src/../node_modules/froala-editor/css/froala_style.min.css';
import 'src/../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery'; // eslint-disable-line import/no-extraneous-dependencies

window.$ = $;
window.jQuery = $;
// END: import for froala-editor

class UploadBook extends Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.handleDescriptionEditorChange = this.handleDescriptionEditorChange.bind(this);
    this.onCoverDrop = this.onCoverDrop.bind(this);
    this.onEpubDrop = this.onEpubDrop.bind(this);
    this.onMobiDrop = this.onMobiDrop.bind(this);
    this.onPdfDrop = this.onPdfDrop.bind(this);
    this.state = {
      descriptionEditor: '',
      epubFile: [],
      mobiFile: [],
      pdfFile: [],
      coverFile: []
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

  handleDescriptionEditorChange = (descriptionEditor) => {
    this.setState({
      descriptionEditor
    });
  };

  formSubmit(e) {
    e.preventDefault();
    const mainProps = this.props;
    const mainState = this.state;
    const data = new FormData();
    data.append('name', this.name.value);
    data.append('author', this.author.value);
    data.append('category', this.category.value);
    data.append('description', mainState.descriptionEditor);
    data.append('cover', mainState.coverFile[0]);
    data.append('epub', mainState.epubFile[0]);
    data.append('mobi', mainState.mobiFile[0]);
    data.append('pdf', mainState.pdfFile[0]);

    bookService.uploadBook(data).then(
      (res) => {
        toast('✅ Upload Success!', toastOptions.INFO);
        mainProps.history.push(`/books/${res.data._id}`);
      },
      (error) => {
        toast(`❌ ${error}`, toastOptions.ERROR);
      }
    );
  }

  render() {
    const mainState = this.state;
    let imagePreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop cover image here
      </p>
    );
    let epubPreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop EPUB here
      </p>
    );
    let mobiPreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop MOBI here
      </p>
    );
    let pdfPreview = (
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
      <div className="upload-book-container">
        <h3>Upload book</h3>
        <form className="upload-book-form" onSubmit={this.formSubmit}>
          <div className="row">
            <div className="col-sm-6 col-md-8 col-lg-9">
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookNameInput ">Book name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Book name"
                  id="bookNameInput"
                  ref={node => (this.name = node)}
                />
              </div>
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="authorInput">Author</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Author"
                  id="authorInput"
                  ref={node => (this.author = node)}
                />
              </div>
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="categoryInput">Category</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Category"
                  id="categoryInput"
                  ref={node => (this.category = node)}
                />
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-3">
              Cover image
              <Dropzone accept="image/jpeg, image/png" onDrop={this.onCoverDrop}>
                {imagePreview}
              </Dropzone>
            </div>
          </div>
          <br />
          <div className="form-group">
            {/* eslint-disable-next-line max-len */}
            {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
            <label htmlFor="descriptionInput">Description</label>
            <FroalaEditor
              id="descriptionInput"
              tag="textarea"
              config={this.froalaConfig}
              model={mainState.descriptionEditor}
              onModelChange={this.handleDescriptionEditorChange}
            />
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookNameInput">EPUB</label>
                <Dropzone accept="application/epub+zip" onDrop={this.onEpubDrop}>
                  {epubPreview}
                </Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
            </div>
            <div className="col-sm-6 col-md-4 col-lg-4">
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookNameInput">MOBI</label>
                <Dropzone onDrop={this.onMobiDrop}>{mobiPreview}</Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="form-group">
                {/* eslint-disable-next-line max-len */}
                {/* eslint-disable-next-line jsx-a11y/label-has-associated-control, jsx-a11y/label-has-for */}
                <label htmlFor="bookNameInput">PDF</label>
                <Dropzone accept="application/pdf" onDrop={this.onPdfDrop}>
                  {pdfPreview}
                </Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
            </div>
          </div>
          <button type="submit" className="btn btn-primary">
            <i className="fa fa-arrow-circle-right fa-fw" />
            Submit
          </button>
        </form>
      </div>
    );
  }
}

export default connect()(withRouter(UploadBook));
