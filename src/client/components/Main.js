import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Async from 'react-code-splitting';
import HomePage from './containers/homePage/HomePage';

const SearchPage = () => <Async load={import('./containers/searchPage/SearchPage.router')} />;
const Books = () => <Async load={import('./containers/bookDetailPage/Books.router')} />;
const LoginRegister = () => <Async load={import('./containers/loginRegisterPage/LoginRegister')} />;
const Logout = () => <Async load={import('./containers/logoutPage/Logout')} />;
const Categories = () => <Async load={import('./containers/categoryPage/Categories.router')} />;
const UploadBook = () => <Async load={import('./containers/uploadPage/UploadBook')} />;
const Profile = () => <Async load={import('./containers/profilePage/Profile.router')} />;
const Chat = () => <Async load={import('./containers/chatPage/Chat')} />;
const PrivacyPolicy = () => <Async load={import('./presentational/PrivacyPolicy')} />;
const Term = () => <Async load={import('./presentational/Term')} />;
const Download = () => <Async load={import('./containers/downloadPage/Download.router')} />;
const Admin = () => <Async load={import('./containers/admin/Admin.router')} />;
const NotFoundRoute = () => <Async load={import('./presentational/NotFoundRoute')} />;

const Main = () => (
  <main className="container">
    <Switch>
      <Route exact path="/" component={HomePage} />
      <Route exact path="/search" component={SearchPage} />
      <Route path="/books" component={Books} />
      <Route path="/categories" component={Categories} />
      <Route exact path="/uploadbook" component={UploadBook} />
      <Route exact path="/loginregister" component={LoginRegister} />
      <Route exact path="/logout" component={Logout} />
      <Route path="/profile" component={Profile} />
      <Route exact path="/chat" component={Chat} />
      <Route exact path="/privacy" component={PrivacyPolicy} />
      <Route exact path="/term" component={Term} />
      <Route path="/download" component={Download} />
      <Route path="/admin" component={Admin} />
      <Route component={NotFoundRoute} />
    </Switch>
  </main>
);

export default Main;
