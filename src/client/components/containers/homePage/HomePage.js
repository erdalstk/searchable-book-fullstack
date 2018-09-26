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
    bookService.getMostDownload(6).then(
      res => {
        this.setState({ mostDownloadData: res.data });
      },
      error => {
        return;
      }
    );

    bookService.getMostView(10).then(
      res => {
        this.setState({ mostViewData: res.data });
      },
      error => {
        return;
      }
    );

    bookService.getRecentlyAdded(10).then(
      res => {
        this.setState({ recentlyAddedData: res.data });
      },
      error => {
        return;
      }
    );
  }

  render() {
    return (
      <div className="home-page-container">
        <FixedGridLayoutView mostDownloadData={this.state.mostDownloadData} />
        <DynamicGridLayoutView
          mostViewData={this.state.mostViewData}
          recentlyAddedData={this.state.recentlyAddedData}
        />
      </div>
    );
  }
}

export default connect()(HomePage);
