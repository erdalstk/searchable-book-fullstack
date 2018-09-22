import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import BooksSearchResult from 'src/client/components/presentational/BooksSearchResult';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';

const SearchPage = () => (
  <Switch>
    <Route exact path="/search" component={BooksSearchResult} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default SearchPage;
