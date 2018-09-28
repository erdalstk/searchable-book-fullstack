/* global FB */
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from 'src/client/services';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { toastOptions } from 'src/client/config';

class Logout extends Component {
  componentDidMount() {
    const mainProps = this.props;
    userService.logout();
    // log out of facebook
    FB.getLoginStatus((response) => {
      if (response && response.status === 'connected') {
        FB.logout(() => {});
      }
    });
    toast('✅ Logout Success', toastOptions.INFO);
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
