import React, { Component } from 'react';
import { Link, withRouter } from 'react-router-dom';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import './UsersManager.Admin.css';
import 'src/../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import { userService } from 'src/client/services';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';

class UsersManager extends Component {
  constructor(props) {
    super(props);
    this.options = {
      defaultSortName: '_id', // default sort column name
      defaultSortOrder: 'asc' // default sort order
    };

    this.state = { users: [] };
    this.originalApiUsers = [];
    this.cellEditProp = {
      mode: 'click',
      blurToSave: true
    };

    this.emailFormatter = this.emailFormatter.bind(this);
    this.enableFormatter = this.enableFormatter.bind(this);
    this.checkEnableOnChange = this.checkEnableOnChange.bind(this);
    this.onUpdateButtonClick = this.onUpdateButtonClick.bind(this);
  }

  componentDidMount() {
    userService.admin_getAllUsers().then(
      res => {
        this.setState({ users: res.data });
        this.originalApiUsers = JSON.parse(JSON.stringify(res.data.slice()));
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

  enableFormatter = (cell, row) => {
    return <input type="checkbox" onChange={(e, data) => this.checkEnableOnChange(row._id)} checked={row.enable} />;
  };

  checkEnableOnChange = data => {
    const prevUsers = this.state.users.slice();
    for (var user of prevUsers) {
      if (user._id === data) {
        user.enable = !user.enable;
        this.setState({ users: prevUsers });
      }
    }
  };

  onUpdateButtonClick = () => {
    const { users } = this.state;
    var postDataUsers = [];
    for (var i = 0; i < users.length; i++) {
      var u = {};
      u._id = users[i]._id;
      if (users[i].level !== this.originalApiUsers[i].level) {
        u.level = users[i].level;
      }
      if (users[i].enable !== this.originalApiUsers[i].enable) {
        u.enable = users[i].enable;
      }
      if (u.level !== undefined || u.enable !== undefined) postDataUsers.push(u);
    }
    if (!postDataUsers.length) {
      alert('No update');
      return;
    }
    userService.admin_updateUsers(postDataUsers).then(
      res => {
        toast('✅ Success!', infoToastOptions);
        this.originalApiUsers = JSON.parse(JSON.stringify(users));
        return;
      },
      error => {
        toast('❌ Error! ' + error, errorToastOptions);
        return;
      }
    );
  };

  render() {
    const { users } = this.state;
    if (!users || !users.length) {
      return <h3>You are not allowed here</h3>;
    }

    return (
      <div>
        <button className="btn btn-primary" onClick={this.onUpdateButtonClick}>
          Update
        </button>
        <br />
        <em>Click on cell to edit</em>
        <BootstrapTable
          version="4"
          data={users}
          insertRow
          exportCSV
          options={this.options}
          hover
          cellEdit={this.cellEditProp}
          className="users-table">
          <TableHeaderColumn
            dataField="_id"
            dataSort
            filter={{ type: 'TextFilter', delay: 500 }}
            editable={false}
            isKey
            width="20%">
            Id
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="email"
            dataSort
            filter={{ type: 'TextFilter', delay: 500 }}
            dataFormat={this.emailFormatter}
            editable={false}
            width="20%">
            Email
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="name"
            dataSort
            filter={{ type: 'TextFilter', delay: 500 }}
            editable={false}
            width="20%">
            Name
          </TableHeaderColumn>
          <TableHeaderColumn
            dataField="level"
            dataSort
            filter={{ type: 'TextFilter', delay: 500 }}
            editable={{ type: 'select', options: { values: [0, 1, 2, 3, 4] } }}
            width="10%">
            Level
          </TableHeaderColumn>
          <TableHeaderColumn dataField="enable" dataSort dataFormat={this.enableFormatter} editable={false} width="10%">
            Enable
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    );
  }
}

export default withRouter(UsersManager);
