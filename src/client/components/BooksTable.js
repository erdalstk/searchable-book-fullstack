import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './BooksTable.css';

class BooksTable extends React.Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: 'name', // default sort column name
      defaultSortOrder: 'asc' // default sort order
    };
  }

  imageFormatter(cell, row) {
    return (
      "<img class='books-table-image' alt='" +
      row.name +
      "' src='" +
      cell +
      "'/>"
    );
  }

  nameFormatter(cell, row) {
    return <Link to={'/books/' + row.id}>{row.name}</Link>;
  }

  categoryFormatter(cell, row) {
    return 'Văn học';
  }

  render() {
    const rows = [];
    if (!this.props.results.length) {
      return (
        <div>
          <p>No book!</p>
        </div>
      );
    }

    return (
      <BootstrapTable
        data={this.props.results}
        options={this.options}
        hover
        pagination
        className="books-table"
      >
        {/* <TableHeaderColumn isKey dataField='id'>#</TableHeaderColumn> */}
        <TableHeaderColumn
          isKey
          dataField="name"
          dataFormat={this.nameFormatter}
          dataSort
          width='30%'
        >
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="author" width='20%'>Author</TableHeaderColumn>
        <TableHeaderColumn
          dataField="description"
          dataFormat={this.categoryFormatter}
          width='25%'
        >
          Description
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="category"
          dataFormat={this.categoryFormatter}
          dataSort
          width='15%'
        >
          Category
        </TableHeaderColumn>
        <TableHeaderColumn dataField="image" dataFormat={this.imageFormatter} width='10%'>
          Cover
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default BooksTable;
