import React from 'react';
import { ToastContainer } from 'react-toastify';
import Header from './containers/header/Header';
import Main from './Main';
import Footer from './presentational/Footer';
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
