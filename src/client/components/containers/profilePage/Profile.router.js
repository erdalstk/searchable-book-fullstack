import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ProfileView from './ProfileView';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';

const Profile = () => (
  <Switch>
    <Route exact path="/profile/:email" component={ProfileView} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default withRouter(Profile);
