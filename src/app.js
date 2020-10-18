const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const middlewares = require('./middlewares');

const api = require('./api/mainroute');

const app = express();  // Open console and Write "npm run Dev"

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.json({
    message: 'WELCOME'
  });
});

app.use('/api', api);


app.use(middlewares.notFound);
app.use(middlewares.errorHandler);

module.exports = app;
