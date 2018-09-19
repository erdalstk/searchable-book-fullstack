import React, { Component } from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import ProfileView from './ProfileView';
import UserManager from './admin/UserManager.Admin';
import NotFoundRoute from './NotFoundRoute';

const Profile = () => (
  <Switch>
    <Route exact path="/profile/all" component={UserManager} />
    <Route exact path="/profile/:email" component={ProfileView} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default withRouter(Profile);
