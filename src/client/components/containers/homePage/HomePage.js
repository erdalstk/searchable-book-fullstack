import React, { Component } from 'react';
import FixedGridLayoutView from 'src/client/components/presentational/FixedGridLayoutView';
import DynamicGridLayoutView from 'src/client/components/presentational/DynamicGridLayoutView';
import { bookService } from 'src/client/services';
import { connect } from 'react-redux';
import './HomePage.css';

class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      recentlyAddedData: [],
      mostDownloadData: [],
      mostViewData: []
    };
  }

  componentDidMount() {
    bookService.getMostDownload(6).then((res) => {
      this.setState({ mostDownloadData: res.data });
    });

    bookService.getMostView(10).then((res) => {
      this.setState({ mostViewData: res.data });
    });

    bookService.getRecentlyAdded(10).then((res) => {
      this.setState({ recentlyAddedData: res.data });
    });
  }

  render() {
    const mainState = this.state;
    return (
      <div className="home-page-container">
        <FixedGridLayoutView mostDownloadData={mainState.mostDownloadData} />
        <DynamicGridLayoutView
          mostViewData={mainState.mostViewData}
          recentlyAddedData={mainState.recentlyAddedData}
        />
      </div>
    );
  }
}

export default connect()(HomePage);
