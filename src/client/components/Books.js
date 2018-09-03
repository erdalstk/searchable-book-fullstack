import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AllBooks from './AllBooks';
import BookDetails from './BookDetails';

const Books = () => (
  <Switch>
    <Route exact path="/books" component={AllBooks} />
    <Route path="/books/:id" component={BookDetails} />
  </Switch>
);

export default Books;
