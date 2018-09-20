import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class Chat extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <h2>Chat Function Under construction</h2>
      </div>
    );
  }
}

export default connect()(withRouter(Chat));
