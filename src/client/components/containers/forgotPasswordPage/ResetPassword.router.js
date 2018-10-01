import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import ResetPassword from './ResetPassword';

const ResetPasswordRouter = () => (
  <Switch>
    <Route exact path="/reset_password/:token" component={ResetPassword} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default ResetPasswordRouter;
