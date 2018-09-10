import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from '../services';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';

class Profile extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const mainProps = this.props;
    userService.profile().then(
      res => {
        mainProps.dispatch(userActions.profileSuccess(res.user));
      },
      error => {
        toast(error, errorToastOptions);
        mainProps.dispatch(userActions.profileFailure());
      }
    );
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <h2>Welcome, {user.name}</h2>
        <p>{user.email}</p>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(withRouter(Profile));
