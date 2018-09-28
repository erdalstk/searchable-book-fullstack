import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userConstants } from 'src/client/config';

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
  user: PropTypes.shape({
    email: PropTypes.string.isRequired,
    level: PropTypes.number.isRequired,
    create_time: PropTypes.string
  }).isRequired
};

export default connect(mapStateToProps)(Overview);
