import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import BooksManager from './BooksManager.Admin';
import UsersManager from './UsersManager.Admin';

const Admin = () => (
  <Switch>
    <Route exact path="/admin/books" component={BooksManager} />
    <Route exact path="/admin/users" component={UsersManager} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default Admin;
