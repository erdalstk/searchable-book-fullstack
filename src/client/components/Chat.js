import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import { userService } from '../services';
import { userActions } from '../actions';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Under construction</h2>
      </div>
    );
  }
}

export default connect()(withRouter(Chat));
