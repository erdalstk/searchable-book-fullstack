import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from 'src/client/services';
import { userActions } from 'src/client/actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from 'src/client/config';

class Logout extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const mainProps = this.props;
    userService.logout();
    // log out of facebook
    FB.getLoginStatus(function(response) {
      if (response && response.status === 'connected') {
        FB.logout(function(response) {});
      }
    });
    toast('✅ Logout Success', infoToastOptions);
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
