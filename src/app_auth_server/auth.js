const express = require('express');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
require('dotenv').config();
const tokenauth = require('./api/auth_api');

const app = express();  // Open console and Write "npm run authServer"

app.use(morgan('dev'));
app.use(helmet());
app.use(cors());
app.use(express.json());


app.use('/', tokenauth);



app.listen(5000)
