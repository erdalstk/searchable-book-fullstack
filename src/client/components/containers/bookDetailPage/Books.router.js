import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import BookDetails from './BookDetails';
import BookDetailsEdit from './BookDetailsEdit';

const Books = () => (
  <Switch>
    <Route exact path="/books/:id" component={BookDetails} />
    <Route exact path="/books/:id/edit" component={BookDetailsEdit} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default Books;
