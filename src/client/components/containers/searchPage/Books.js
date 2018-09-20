import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import BooksSearchResult from 'src/client/components/presentational/BooksSearchResult';
import BookDetails from '../bookDetailPage/BookDetails';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import BooksManager from '../admin/BooksManager.Admin';

const Books = () => (
  <Switch>
    <Route exact path="/books" component={BooksSearchResult} />
    <Route exact path="/books/all" component={BooksManager} />
    <Route exact path="/books/:id" component={BookDetails} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default Books;
