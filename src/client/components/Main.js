import React, { Component } from 'react';
import { Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';
import HomePage from './containers/homePage/HomePage';
const Books = () => <Async load={import('./containers/searchPage/Books')} />;
const Login = () => <Async load={import('./containers/loginPage/Login')} />;
const Logout = () => <Async load={import('./containers/logoutPage/Logout')} />;
const Categories = () => <Async load={import('./containers/categoryPage/Categories')} />;
const UploadBook = () => <Async load={import('./containers/uploadPage/UploadBook')} />;
const Register = () => <Async load={import('./containers/registerPage/Register')} />;
const Profile = () => <Async load={import('./containers/profilePage/Profile')} />;
const Chat = () => <Async load={import('./containers/chatPage/Chat')} />;
const PrivacyPolicy = () => <Async load={import('./presentational/PrivacyPolicy')} />;
const Term = () => <Async load={import('./presentational/Term')} />;
const Download = () => <Async load={import('./containers/downloadPage/Download')} />;
const NotFoundRoute = () => <Async load={import('./presentational/NotFoundRoute')} />;

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
