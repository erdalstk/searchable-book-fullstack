import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import { imageConstants } from 'src/client/config';
import { noPictureUtil, propTypesHelper } from 'src/client/helpers';
import FroalaEditorView from 'react-froala-wysiwyg/FroalaEditorView';
import './BooksTable.css';
import 'src/../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';

const BooksTable = ({ books }) => {
  const options = {
    defaultSortName: 'name', // default sort column name
    defaultSortOrder: 'asc' // default sort order
  };

  const descriptionFormatter = (cell, row) => {
    let des = '';
    if (row.description) {
      des = row.description;
      if (des.length > 500) {
        des = `${des.slice(0, 500)}...`;
      }
    }
    return (
      <div className="books-table-description">
        <FroalaEditorView model={des} />
      </div>
    );
  };

  const basicInfoFormatter = (cell, row) => (
    <div>
      <div className="row">
        <div className="col-sm-5 col-md-3 col-lg-3 bookcover">
          <Link to={`/books/${row._id}`}>
            <img
              className="books-table-image"
              onError={noPictureUtil.noPictureAddDefaultSrc}
              alt={row.name}
              src={imageConstants.STATIC_IMAGE_URL + row.cover}
            />
          </Link>
        </div>
        <div className="col-sm-7 col-md-9 col-lg-9 bookmeta">
          <div className="bookmeta-title">
            <Link to={`/books/${row._id}`}>{row.name}</Link>
          </div>
          <p className="bookmeta-author">{row.author}</p>
          <p className="bookmeta-category">{row.category}</p>
        </div>
      </div>
    </div>
  );

  if (!books || !books.length) {
    return (
      <div>
        <p>No book here</p>
      </div>
    );
  }

  return (
    <BootstrapTable
      version="4"
      data={books}
      options={options}
      hover
      pagination
      className="books-table"
    >
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

BooksTable.defaultProps = {
  books: []
};

BooksTable.propTypes = {
  books: PropTypes.arrayOf(propTypesHelper.Book)
};

export default BooksTable;
