import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from '../services';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const mainProps = this.props;
    userService.logout();
    toast('Logout Success', infoToastOptions);
    mainProps.dispatch(userActions.logout());
    mainProps.history.push('/');
  }

  render() {
    return (
      <div>
        <h2>Success</h2>
      </div>
    );
  }
}

export default connect()(withRouter(Logout));
