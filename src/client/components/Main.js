import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchableBook from './SearchableBook';
import Books from './Books';
import Login from './Login';
import Logout from './Logout';
import Categories from './Categories';
import UploadBook from './UploadBook';
import Register from './Register';
import Profile from './Profile';
import Chat from './Chat';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={SearchableBook} />
      <Route path="/books" component={Books} />
      <Route path="/categories" component={Categories} />
      <Route path="/uploadbook" component={UploadBook} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/register" component={Register} />
      <Route path="/profile" component={Profile} />
      <Route path="/chat" component={Chat} />
    </Switch>
  </main>
);

export default Main;
