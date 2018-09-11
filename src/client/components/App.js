import React, { Component } from 'react';
import Header from './Header';
import Main from './Main';
import Footer from './Footer';
import { ToastContainer } from 'react-toastify';
import '../../../node_modules/react-toastify/dist/ReactToastify.css';
const App = () => (
  <div>
    <ToastContainer />
    <Header />
    <Main />
    <Footer />
  </div>
);

export default App;
