const express = require('express');

const app = express();
const connectMongoWithRetry = require('./helpers/mongoose.helper');
const logger = require('./helpers/logging.helper');
const config = require('./config/main');

// serve static files
app.use(express.static('dist'));
app.use('/static', express.static('static'));

// connect to mongo
connectMongoWithRetry();

// api
const auth = require('./api/auth');
const profile = require('./api/profile.js');
const books = require('./api/books.js');
const instantsearch = require('./api/instantsearch.js');
const categories = require('./api/categories.js');
const recentlyadded = require('./api/recentlyadded');
const mostview = require('./api/mostview');
const mostdownload = require('./api/mostdownload');
const downloadebook = require('./api/downloadebook');
const booksAdmin = require('./api/admin/books.admin.js');
const usersAdmin = require('./api/admin/users.admin.js');

app.use('/api/auth', auth);
app.use('/api/profile', profile);
app.use('/api/books', books);
app.use('/api/instantsearch', instantsearch);
app.use('/api/categories', categories);
app.use('/api/recentlyadded', recentlyadded);
app.use('/api/mostview', mostview);
app.use('/api/mostdownload', mostdownload);
app.use('/api/downloadebook', downloadebook);
app.use('/api/admin/books', booksAdmin);
app.use('/api/admin/users', usersAdmin);

// router
const testssr = require('./router/testssr.js');
const homepage = require('./router/homepage.js');

app.use('/testssr', testssr);
app.use('/', homepage);

// handle 404
app.get('*', (req, res) => {
  res.status(404).send('404 Not Found');
});

// start server
app.listen(config.app.port, () => logger.log('info', `Listening on port ${config.app.port}`));
