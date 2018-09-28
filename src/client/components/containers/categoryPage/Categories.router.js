import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import Category from './Category';
import AllCategories from './AllCategories';

const Categories = () => (
  <Switch>
    <Route exact path="/categories" component={AllCategories} />
    <Route exact path="/categories/:id" component={Category} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default Categories;
