import React from 'react';
import { Switch, Route } from 'react-router-dom';
import AllCategories from './AllCategories';
import Category from './Category';

const Categories = () => (
  <Switch>
    <Route exact path="/categories" component={AllCategories} />
    <Route path="/categories/:id" component={Category} />
  </Switch>
);

export default Categories;
