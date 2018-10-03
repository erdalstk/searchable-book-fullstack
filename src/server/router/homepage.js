import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import { createStore } from 'redux';
import { Provider } from 'react-redux';

// import HomePage from 'src/client/components/containers/homePage/HomePage';
// import Header from '../../client/components/containers/header/Header';
import TestSSR from '../../common/testSSR/TestSSR';
import rootReducer from '../../client/reducers/index';
// import 'src/client/index.css';
import Html from '../../common/HtmlTemplate';

const store = createStore(rootReducer);

const router = express.Router();

// Routes will go here
module.exports = router;

router.get('/', (req, res) => {
  /**
   * renderToString() will take our React app and turn it into a string
   * to be inserted into our Html template function.
   */
  const body = renderToString(
    <Provider store={store}>
      <div>
        <TestSSR />
        {/* <Header /> */}
        {/* <HomePage /> */}
        {/* <Footer /> */}
      </div>
    </Provider>
  );
  const title = 'Home';
  // res.send('hello');
  res.send(
    Html({
      body,
      title
    })
  );
});
