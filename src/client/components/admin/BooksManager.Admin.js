import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './BooksManager.Admin.css';
import '../../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { STATIC_IMAGE_URL, NO_COVER_IMAGE } from '../../config';
import { noPictureAddDefaultSrc } from '../../helpers';
import { bookService } from '../../services';

class BooksManager extends Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: 'name', // default sort column name
      defaultSortOrder: 'asc' // default sort order
    };
    this.state = { books: [] };
    this.idFormatter = this.idFormatter.bind(this);
    this.uploadbyFormatter = this.uploadbyFormatter.bind(this);
  }

  componentDidMount() {
    bookService.admin_getAllBooks().then(
      res => {
        this.setState({ books: res.data });
      },
      error => {
        return;
      }
    );
  }

  idFormatter = (cell, row) => {
    if (row._id) {
      return (
        <div>
          <Link to={'/books/' + row._id}>{row._id}</Link>
        </div>
      );
    }
  };

  uploadbyFormatter = (cell, row) => {
    if (row.create_by) {
      return (
        <div>
          <Link to={'/profile/' + row.create_by}>{row.create_by}</Link>
        </div>
      );
    }
  };

  render() {
    const { books } = this.state;
    if (!books || !books.length) {
      return <h3>You are not allowed here</h3>;
    }

    return (
      <BootstrapTable version='4' data={books} options={this.options} hover className="books-table">
        <TableHeaderColumn dataSort dataField="_id" dataFormat={this.idFormatter} isKey width="20%">
          Id
        </TableHeaderColumn>
        <TableHeaderColumn dataSort dataField="name" width="30%">
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataSort dataField="create_by" dataFormat={this.uploadbyFormatter} width="20%">
          Upload By
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default withRouter(BooksManager);
