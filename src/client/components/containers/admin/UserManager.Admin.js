import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './UserManager.Admin.css';
import 'src/../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { userService } from 'src/client/services';

class UserManager extends Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: '_id', // default sort column name
      defaultSortOrder: 'asc' // default sort order
    };

    this.state = { users: [] };
    this.emailFormatter = this.emailFormatter.bind(this);
  }

  componentDidMount() {
    userService.admin_getAllUsers().then(
      res => {
        this.setState({ users: res.data });
      },
      error => {
        return;
      }
    );
  }

  emailFormatter = (cell, row) => {
    if (row.email) {
      return (
        <div>
          <Link to={'/profile/' + row.email}>{row.email}</Link>
        </div>
      );
    }
  };

  render() {
    const { users } = this.state;
    if (!users || !users.length) {
      return <h3>You are not allowed here</h3>;
    }

    return (
      <BootstrapTable version="4" data={users} options={this.options} hover className="users-table">
        <TableHeaderColumn dataField="_id" dataSort isKey width="20%">
          Id
        </TableHeaderColumn>
        <TableHeaderColumn dataField="email" dataSort dataFormat={this.emailFormatter} width="40%">
          Email
        </TableHeaderColumn>
        <TableHeaderColumn dataField="name" dataSort width="20%">
          Name
        </TableHeaderColumn>
        <TableHeaderColumn dataField="level" dataSort width="10%">
          Level
        </TableHeaderColumn>
        <TableHeaderColumn dataField="active" dataSort width="10%">
          Active
        </TableHeaderColumn>
      </BootstrapTable>
    );
  }
}

export default withRouter(UserManager);
