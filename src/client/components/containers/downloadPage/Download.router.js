import React from 'react';
import { Switch, Route } from 'react-router-dom';
import NotFoundRoute from 'src/client/components/presentational/NotFoundRoute';
import DownloadEbook from './DownloadEbook';

const Download = () => (
  <Switch>
    <Route exact path="/download/:id/:type" component={DownloadEbook} />
    <Route component={NotFoundRoute} />
  </Switch>
);

export default Download;
