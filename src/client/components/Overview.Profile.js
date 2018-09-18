import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userService } from '../services/user.service';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';

class Overview extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { user } = this.props;
    return (
      <div>
        <h3>Account Overview</h3>
        <div className="email">
          <p>Email: {user.email}</p>
        </div>
        <div className="level">
          <p>Level: {user.level}</p>
        </div>
        <div className="create-time">
          <p>Created in: {user.create_time}</p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps)(Overview);
