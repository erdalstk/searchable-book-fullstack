import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { bookService } from 'src/client/services';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';
import Dropzone from 'react-dropzone';
// if use async/await import 'babel-polyfill';
import 'whatwg-fetch';
import './UploadBook.css';
// BEGIN import for froala-editor
import 'src/../node_modules/froala-editor/js/froala_editor.pkgd.min.js';
import 'src/../node_modules/froala-editor/css/froala_style.min.css';
import 'src/../node_modules/froala-editor/css/froala_editor.pkgd.min.css';
import FroalaEditor from 'react-froala-wysiwyg';
import $ from 'jquery';
window.$ = $;
window.jQuery = $;
// END: import for froala-editor

class UploadBook extends Component {
  constructor(props) {
    super(props);
    this.formSubmit = this.formSubmit.bind(this);
    this.handleDescriptionEditorChange = this.handleDescriptionEditorChange.bind(this);
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

  formSubmit(e) {
    e.preventDefault();
    var infoToastOpt = infoToastOptions;
    var errorToastOpt = errorToastOptions;
    var historyProps = this.props.history;
    var data = new FormData();
    data.append('name', this.name.value);
    data.append('author', this.author.value);
    data.append('category', this.category.value);
    data.append('description', this.state.descriptionEditor);
    data.append('cover', this.state.coverFile[0]);
    data.append('epub', this.state.epubFile[0]);
    data.append('mobi', this.state.mobiFile[0]);
    data.append('pdf', this.state.pdfFile[0]);

    bookService.uploadBook(data).then(
      res => {
        toast('✅ Upload Success!', infoToastOpt);
        historyProps.push('/books/' + res.data._id);
        return;
      },
      error => {
        toast('❌ ' + error, errorToastOpt);
        return;
      }
    );
  }

  onCoverDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      coverFile: files.slice(0, 1)
    });
  }

  onEpubDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      epubFile: files.slice(0, 1)
    });
  }
  onMobiDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      mobiFile: files.slice(0, 1)
    });
  }
  onPdfDrop(files) {
    if (files.slice(0, 1)[0].size > this.maxFileSize) {
      toast('File size must below 5MB', errorToastOptions);
      return;
    }
    this.setState({
      pdfFile: files.slice(0, 1)
    });
  }
  handleDescriptionEditorChange = descriptionEditor => {
    this.setState({
      descriptionEditor: descriptionEditor
    });
  };

  render() {
    var imagePreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop cover image here
      </p>
    );
    var epubPreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop EPUB here
      </p>
    );
    var mobiPreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop MOBI here
      </p>
    );
    var pdfPreview = (
      <p className="upload-image-dropzone-text">
        <i className="fa fa-upload fa-3x" />
        <br />
        <br />
        Drop PDF here
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
      <div className="upload-container">
        <h3>Upload book</h3>
        <form className="upload-book-form" onSubmit={this.formSubmit}>
          <div className="row">
            <div className="col-sm-6 col-md-8 col-lg-9">
              <div className="form-group">
                <label htmlFor="bookNameInput">Book name</label>
                <input
                  type="text"
                  className="form-control"
                  placeholder="Book name"
                  id="bookNameInput"
                  ref={node => (this.name = node)}
                />
              </div>
              <div className="form-group">
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
              <div className="form-group">
                <label htmlFor="coverInput">Cover image</label>
                <Dropzone accept="image/jpeg, image/png" onDrop={this.onCoverDrop.bind(this)}>
                  {imagePreview}
                </Dropzone>
              </div>
            </div>
          </div>
          <br />
          <div className="form-group">
            <label htmlFor="descriptionInput">Description</label>
            <FroalaEditor
              tag="textarea"
              config={this.froalaConfig}
              model={this.state.descriptionEditor}
              onModelChange={this.handleDescriptionEditorChange}
            />
          </div>
          <div className="row">
            <div className="col-sm-6 col-md-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="bookNameInput">EPUB</label>
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
                <label htmlFor="bookNameInput">MOBI</label>
                <Dropzone onDrop={this.onMobiDrop.bind(this)}>{mobiPreview}</Dropzone>
                <small id="fileSizeHelp" className="form-text text-muted">
                  File size below 5MB
                </small>
              </div>
            </div>
            <div className="col-sm-12 col-md-4 col-lg-4">
              <div className="form-group">
                <label htmlFor="bookNameInput">PDF</label>
                <Dropzone accept="application/pdf" onDrop={this.onPdfDrop.bind(this)}>
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
