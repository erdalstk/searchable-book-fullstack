import React, { Component } from 'react';
import Header from './presentational/Header';
import Main from './Main';
import Footer from './presentational/Footer';
import { ToastContainer } from 'react-toastify';
import 'src/../node_modules/react-toastify/dist/ReactToastify.css';
const App = () => (
  <div>
    <ToastContainer />
    <Header />
    <Main />
    <Footer />
  </div>
);

export default App;
