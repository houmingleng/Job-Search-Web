const express = require('express');
const session = require('express-session');
const path = require('path');
const logger = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');

const url = process.env.DATABASE_URL || 'mongodb://localhost:27017';

mongoose.connect(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

require('./models/User');
require('./models/Job');

const router = express.Router();

require('./routes/auth')(router);
require('./routes/job')(router);

const app = express();

app.use(logger('dev'));
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
  secret: 'hireme',
  resave: false,
  saveUninitialized: true
}));

app.use(express.static(path.join(__dirname, '../build')));
app.use('/public', express.static(path.join(__dirname, '../public')));
app.use('/api', router);

app.get('*', (req, res) => {
  res.sendFile('build/index.html', { root: path.join(__dirname, '../') });
});

module.exports = app;
