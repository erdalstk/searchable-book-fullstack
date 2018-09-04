import React from 'react';
import { Switch, Route } from 'react-router-dom';
import SearchableBook from './SearchableBook';
import Books from './Books';
import Login from './Login';
import Logout from './Logout';
import Signup from './Signup';
import Categories from './Categories';

const Main = () => (
  <main>
    <Switch>
      <Route exact path="/" component={SearchableBook} />
      <Route path="/books" component={Books} />
      <Route path="/categories" component={Categories} />
      <Route path="/login" component={Login} />
      <Route path="/logout" component={Logout} />
      <Route path="/signup" component={Signup} />
    </Switch>
  </main>
);

export default Main;
