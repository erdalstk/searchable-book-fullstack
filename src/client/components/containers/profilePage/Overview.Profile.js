import React, { Component } from 'react';
import { connect } from 'react-redux';
import { userConstants } from 'src/client/config';
import { propTypesHelper } from 'src/client/helpers';

class Overview extends Component {
  componentDidMount() {}

  render() {
    const { user } = this.props;
    return (
      <div>
        <h3>Account Overview</h3>
        <div className="level">
          <p>
            Level:
            <strong>{userConstants.USER_LEVEL[user.level]}</strong>
          </p>
        </div>
        <div className="create-time">
          <p>
            Created in:
            {user.create_time}
          </p>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  user: state.user
});

Overview.propTypes = {
  user: propTypesHelper.User.isRequired
};

export default connect(mapStateToProps)(Overview);
