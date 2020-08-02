const express = require('express');

const user=require('./user');

const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome! Test Api { Hasan Şahin }'
  });
});

router.use('/users', user);

module.exports = router;
