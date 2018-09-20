import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BooksTable from 'src/client/components/presentational/BooksTable';
import { fetchSearchBarResultsCompleted } from 'src/client/actions';
import { categoryService } from 'src/client/services';
import 'whatwg-fetch';
import { isStringEmptyOrSpaces } from 'src/client/helpers';

class Category extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    if (isStringEmptyOrSpaces(this.props.match.params.id)) {
      return;
    }
    categoryService.getBooksInCategory(this.props.match.params.id).then(
      res => {
        this.props.dispatch(fetchSearchBarResultsCompleted(res.data));
      },
      error => {
        // toast(error, errorToastOptions);
        return;
      }
    );
  }

  componentDidUpdate(prevProps) {
    if (isStringEmptyOrSpaces(this.props.match.params.id)) {
      return;
    }
    if (this.props.match.params.id !== prevProps.match.params.id) {
      categoryService.getBooksInCategory(this.props.match.params.id).then(
        res => {
          this.props.dispatch(fetchSearchBarResultsCompleted(res.data));
        },
        error => {
          // toast(error, errorToastOptions);
          return;
        }
      );
    }
  }

  render() {
    return <BooksTable books={this.props.searchBarResults} />;
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(withRouter(Category));
