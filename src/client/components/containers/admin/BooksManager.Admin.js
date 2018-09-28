import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './BooksManager.Admin.css';
import 'src/../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { bookService } from 'src/client/services';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';

class BooksManager extends Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: '_id', // default sort column name
      defaultSortOrder: 'asc' // default sort order
    };
    this.state = { books: [] };
    this.originalApiBooks = [];
    this.cellEditProp = {
      mode: 'click',
      blurToSave: true
    };

    this.idFormatter = this.idFormatter.bind(this);
    this.uploadbyFormatter = this.uploadbyFormatter.bind(this);
    this.enableFormatter = this.enableFormatter.bind(this);
    this.checkEnableOnChange = this.checkEnableOnChange.bind(this);
    this.onEnableButtonClick = this.onEnableButtonClick.bind(this);
  }

  componentDidMount() {
    bookService.adminGetAllBooks().then(
      (res) => {
        this.setState({ books: res.data });
        this.originalApiBooks = JSON.parse(JSON.stringify(res.data.slice()));
      },
      (error) => {
        toast(error, toastOptions.ERROR);
      }
    );
  }

  idFormatter = (cell, row) => {
    if (row._id) {
      return (
        <div>
          <Link to={`/books/${row._id}`}>{row._id}</Link>
        </div>
      );
    }
    return '';
  };

  uploadbyFormatter = (cell, row) => {
    if (row.create_by) {
      return (
        <div>
          <Link to={`/profile/${cell}`}>{cell}</Link>
        </div>
      );
    }
    return '';
  };

  enableFormatter = (cell, row) => (
    <input
      type="checkbox"
      onChange={() => this.checkEnableOnChange(row._id)}
      checked={row.enable}
    />
  );

  checkEnableOnChange = (data) => {
    const mainState = this.state;
    const prevBooks = mainState.books.slice();
    const selectedBook = prevBooks.find(b => b._id === data);
    selectedBook.enable = !selectedBook.enable;
    this.setState({ ...prevBooks });
  };

  onEnableButtonClick = () => {
    const { books } = this.state;
    const postDataBooks = [];
    for (let i = 0; i < books.length; i += 1) {
      const book = {};
      book._id = books[i]._id;
      if (books[i].enable !== this.originalApiBooks[i].enable) {
        book.enable = books[i].enable;
      }
      if (books[i].name !== this.originalApiBooks[i].name) {
        book.name = books[i].name;
      }
      if (books[i].create_by !== this.originalApiBooks[i].create_by) {
        book.create_by = books[i].create_by;
      }
      if (books[i].update_by !== this.originalApiBooks[i].update_by) {
        book.update_by = books[i].update_by;
      }
      if (
        book.name !== undefined
        || book.create_by !== undefined
        || book.update_by !== undefined
        || book.enable !== undefined
      ) postDataBooks.push(book);
    }
    if (!postDataBooks.length) {
      toast('Nothing to update!', toastOptions.ERROR);
      return;
    }
    bookService.adminUpdateBooks(postDataBooks).then(
      () => {
        toast('✅ Success!', toastOptions.INFO);
        this.originalApiBooks = JSON.parse(JSON.stringify(books));
      },
      (error) => {
        toast(`❌ Error! ${error}`, toastOptions.ERROR);
      }
    );
  };

  render() {
    const { books } = this.state;
    if (!books || !books.length) {
      return <h3>You are not allowed here</h3>;
    }

    return (
      <div>
        <button type="button" className="btn btn-primary" onClick={this.onEnableButtonClick}>
          Update
        </button>
        <br />
        <em>Click on cell to edit</em>
        <BootstrapTable
          version="4"
          data={books}
          insertRow
          exportCSV
          options={this.options}
          hover
          cellEdit={this.cellEditProp}
          className="books-table"
        >
          <TableHeaderColumn
            dataSort
            dataField="_id"
            filter={{ type: 'TextFilter', delay: 500 }}
            dataFormat={this.idFormatter}
            isKey
            width="10%"
          >
            Id
          </TableHeaderColumn>
          <TableHeaderColumn
            dataSort
            dataField="name"
            filter={{ type: 'TextFilter', delay: 500 }}
            width="30%"
          >
            Name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataSort
            dataField="create_by"
            filter={{ type: 'TextFilter', delay: 500 }}
            width="15%"
          >
            Create By
          </TableHeaderColumn>
          <TableHeaderColumn
            dataSort
            dataField="update_by"
            filter={{ type: 'TextFilter', delay: 500 }}
            width="15%"
          >
            Update By
          </TableHeaderColumn>
          <TableHeaderColumn
            dataSort
            dataField="enable"
            editable={false}
            dataFormat={this.enableFormatter}
            width="10%"
          >
            Enable
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default withRouter(BooksManager);
