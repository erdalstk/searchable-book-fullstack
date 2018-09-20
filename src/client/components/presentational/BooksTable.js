import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './BooksTable.css';
import 'src/../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from 'src/client/config';
import { noPictureAddDefaultSrc } from 'src/client/helpers';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';

const BooksTable = ({ books }) => {
  const options = {
    defaultSortName: 'name', // default sort column name
    defaultSortOrder: 'asc' // default sort order
  };

  const descriptionFormatter = (cell, row) => {
    if (row.description) {
      if (row.description.length > 500) {
        row.description = row.description.slice(0, 500) + '...';
      }
      return (
        <div className="books-table-description">
          <FroalaEditorView model={row.description} />
        </div>
      );
    }
  };

  const basicInfoFormatter = (cell, row) => {
    return (
      <div>
        <div className="row">
          <div className="col-sm-5 col-md-3 col-lg-3 bookcover">
            <Link to={'/books/' + row._id}>
              <img
                className="books-table-image"
                onError={noPictureAddDefaultSrc}
                alt={row.name}
                src={STATIC_IMAGE_URL + row.cover}
              />
            </Link>
          </div>
          <div className="col-sm-7 col-md-9 col-lg-9 bookmeta">
            <div className="bookmeta-title">
              <Link to={'/books/' + row._id}>{row.name}</Link>
            </div>
            <p className="bookmeta-author">{row.author}</p>
            <p className="bookmeta-category">{row.category}</p>
          </div>
        </div>
      </div>
    );
  };

  if (!books || !books.length) {
    return (
      <div>
        <p>No book here</p>
      </div>
    );
  }

  return (
    <BootstrapTable version="4" data={books} options={options} hover pagination className="books-table">
      <TableHeaderColumn dataField="_id" isKey width="50%" hidden>
        Id
      </TableHeaderColumn>
      <TableHeaderColumn dataSort dataField="name" dataFormat={basicInfoFormatter} width="40%">
        Info
      </TableHeaderColumn>
      <TableHeaderColumn dataField="description" dataFormat={descriptionFormatter} width="60%">
        Description
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default BooksTable;
