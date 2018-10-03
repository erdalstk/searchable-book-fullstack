import express from 'express';
import React from 'react';
import { renderToString } from 'react-dom/server';
import TestSSR from '../../common/testSSR/TestSSR';
import Html from '../../common/HtmlTemplate';

const router = express.Router();

// Routes will go here
module.exports = router;

router.get('/', (req, res) => {
  /**
   * renderToString() will take our React app and turn it into a string
   * to be inserted into our Html template function.
   */
  const body = renderToString(<TestSSR />);
  const title = 'Server side Rendering with Styled Components';
  // res.send('hello');
  res.send(
    Html({
      body,
      title
    })
  );
});
