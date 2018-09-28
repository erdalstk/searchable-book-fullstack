import React from 'react';
import { Switch, Route, withRouter } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import ProfileView from './ProfileView';

const Profile = () => (
  <Switch>
    <Route exact path="/profile/:email" component={ProfileView} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default withRouter(Profile);
