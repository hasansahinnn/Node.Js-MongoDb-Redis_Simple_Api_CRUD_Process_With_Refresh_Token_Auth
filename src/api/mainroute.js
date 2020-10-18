const express = require('express');

const user=require('./user');
const router = express.Router();
const jwt=require('jsonwebtoken')

function authencticateToken(req,res,next){
  const authHeader=req.headers['authorization']
  const token=authHeader && authHeader.split(' ')[1]
  if(token==null) return res.status(401).send()

  jwt.verify(token,process.env.JWT_ACCESS_TOKEN,(err,user)=>{
    if(err) return res.status(401).send()
    req.user=user
    next()
  })
}

router.get('/', (req, res) => {
  res.json({
    message: 'Welcome! Test Api { Hasan Şahin }'
  });
});

router.use('/users',authencticateToken, user);

module.exports = router;
