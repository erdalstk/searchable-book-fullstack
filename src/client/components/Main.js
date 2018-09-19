import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';
import HomePage from './HomePage';
const Books = () => <Async load={import('./Books')} />;
const Login = () => <Async load={import('./Login')} />;
const Logout = () => <Async load={import('./Logout')} />;
const Categories = () => <Async load={import('./Categories')} />;
const UploadBook = () => <Async load={import('./UploadBook')} />;
const Register = () => <Async load={import('./Register')} />;
const Profile = () => <Async load={import('./Profile')} />;
const Chat = () => <Async load={import('./Chat')} />;
const PrivacyPolicy = () => <Async load={import('./PrivacyPolicy')} />;
const Term = () => <Async load={import('./Term')} />;
const Download = () => <Async load={import('./Download')} />;
const NotFoundRoute = () => <Async load={import('./NotFoundRoute')} />;

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route path="/books" component={Books} />
      <Route path="/categories" component={Categories} />
      <Route exact path="/uploadbook" component={UploadBook} />
      <Route exact path="/login" component={Login} />
      <Route exact path="/logout" component={Logout} />
      <Route exact path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route exact path="/chat" component={Chat} />
      <Route exact path="/privacy" component={PrivacyPolicy} />
      <Route exact path="/term" component={Term} />
      <Route path="/download" component={Download} />
      <Route component={NotFoundRoute} />
    </Switch>
  </main>
);

export default Main;
