import React, { Component } from 'react';
import SearchBar from '../searchBar/SearchBar';
import IndexGridView from 'src/client/components/presentational/IndexGridView';
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
    bookService.getMostDownload(10).then(
      res => {
        this.setState({ mostDownloadData: res.data });
      },
      error => {
        // toast(error, errorToastOptions);
        return;
      }
    );

    bookService.getMostView(10).then(
      res => {
        this.setState({ mostViewData: res.data });
      },
      error => {
        // toast(error, errorToastOptions);
        return;
      }
    );

    bookService.getRecentlyAdded(10).then(
      res => {
        this.setState({ recentlyAddedData: res.data });
      },
      error => {
        // toast(error, errorToastOptions);
        return;
      }
    );
  }

  render() {
    return (
      <div className="main-box">
        <div className="search-bar">
          <SearchBar />
        </div>
        <div className="main-view">
          <IndexGridView
            mostDownloadData={this.state.mostDownloadData}
            mostViewData={this.state.mostViewData}
            recentlyAddedData={this.state.recentlyAddedData}
          />
        </div>
      </div>
    );
  }
}

export default connect()(HomePage);
