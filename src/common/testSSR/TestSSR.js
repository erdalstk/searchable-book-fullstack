/* eslint-disable */
import React, { Component } from 'react';

class TestSSR extends Component {
  constructor(props) {
    super(props);
    // let name;
    this.state = {
      name: ''
    };
  }

  componentDidMount() {
    if (!this.state.name) {
      this.fetchName();
    }
  }

  fetchName() {
    console.log('this.fetchName()');
    this.setState({ name: 'Hao' });
  }

  render() {
    const { data } = this.props;
    return (
      <div>
        Hello
        {data}
      </div>
    );
  }
}

export default TestSSR;
