import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './BooksTable.css';
import { STATIC_IMAGE_URL } from '../config/Constants';

const BooksTable = ({ books }) => {
  const options = {
    defaultSortName: 'name', // default sort column name
    defaultSortOrder: 'asc' // default sort order
  };

  const imageFormatter = (cell, row) => {
    return "<img class='books-table-image' alt='" + row.name + "' src='" + STATIC_IMAGE_URL + cell + "'/>";
  };

  const nameFormatter = (cell, row) => {
    return <Link to={'/books/' + row.id}>{row.name}</Link>;
  };

  const rows = [];
  if (!books || !books.length) {
    return (
      <div>
        <p>No book!</p>
      </div>
    );
  }

  return (
    <BootstrapTable data={books} options={options} hover pagination className="books-table">
      <TableHeaderColumn isKey dataField="name" dataFormat={nameFormatter} dataSort width="30%">
        Name
      </TableHeaderColumn>
      <TableHeaderColumn dataField="author" width="25%">
        Author
      </TableHeaderColumn>
      <TableHeaderColumn dataField="category" dataSort width="20%">
        Category
      </TableHeaderColumn>
      <TableHeaderColumn dataField="cover" dataFormat={imageFormatter} width="25%">
        Cover
      </TableHeaderColumn>
    </BootstrapTable>
  );
};

export default BooksTable;
