import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';
import BooksTable from 'src/client/components/presentational/BooksTable';
import { searchBarActions } from 'src/client/actions';
import { categoryService } from 'src/client/services';
import 'whatwg-fetch';
import { stringUtils } from 'src/client/helpers';

class Category extends Component {
  componentDidMount() {
    const mainProps = this.props;
    if (stringUtils.isStringEmptyOrSpaces(mainProps.match.params.id)) {
      return;
    }
    categoryService.getBooksInCategory(mainProps.match.params.id).then((res) => {
      mainProps.dispatch(searchBarActions.fetchSearchBarResultsCompleted(res.data));
    });
  }

  componentDidUpdate(prevProps) {
    const mainProps = this.props;
    if (stringUtils.isStringEmptyOrSpaces(mainProps.match.params.id)) {
      return;
    }
    if (mainProps.match.params.id !== prevProps.match.params.id) {
      categoryService.getBooksInCategory(mainProps.match.params.id).then((res) => {
        mainProps.dispatch(searchBarActions.fetchSearchBarResultsCompleted(res.data));
      });
    }
  }

  render() {
    const mainProps = this.props;
    return <BooksTable books={mainProps.searchBarResults} />;
  }
}

const mapStateToProps = state => ({
  searchBarResults: state.searchBarResults
});

export default connect(mapStateToProps)(withRouter(Category));
