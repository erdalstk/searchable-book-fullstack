import React, { Component } from 'react';
import SearchBar from './SearchBar';
import IndexGridView from './IndexGridView';
import './HomePage.css';
import { toast } from 'react-toastify';
import { infoToastOptions, errorToastOptions } from '../config';
import { bookService } from '../services';
import { connect } from 'react-redux';
import { changeSearchBarFilterText } from '../actions';

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
    this.props.dispatch(changeSearchBarFilterText(''));
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
