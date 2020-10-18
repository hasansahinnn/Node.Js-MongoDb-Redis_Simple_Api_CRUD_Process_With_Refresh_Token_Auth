const express = require('express');
const monk = require('monk'); //Mongo Db Driver
const Joi = require('@hapi/joi')
const router=express.Router()

//Mongodb
const db=monk(process.env.MONGO_URI)
const users=db.get('users') // Get Collection
//Redis
const redisConnection = require('redis')
const redis    = redisConnection.createClient({
    port      : 18901,               // replace with your port
    host      : process.env.REDIS_URI,        // replace with your hostanme or IP address
    password  : process.env.REDIS_PW  })
//Jwt
const jwt=require('jsonwebtoken')

redis.on('connect', function () {
    console.log('Redis connected');
});


router.post('/login', async (req,res,next)=>{
    try {
        const value = req.body;
        const userCheck=await users.findOne({email:value.email,password:value.password});
        if(userCheck){
          const accessToken = generateAccessToken(userCheck)
          const refreshToken = generateRefreshToken(userCheck)
          redis.set(refreshToken,JSON.stringify(userCheck),'EX', 604800) // REDIS - save user info and token (604800 sec = 1 week)
          return res.status(200).send({accessToken:accessToken,refreshToken:refreshToken});
        }else{
            return res.status(401).send("Invalid User");
        }
    } catch (error) {
        next(error);
    }
})

router.post('/refreshToken',(req,res)=>{
    const refreshToken=req.body.refreshtoken
    redis.get(refreshToken, function (err, value) { //Check redis
        if(value){ // for create new token : parse value json || use jwt verify  
            jwt.verify(refreshToken,process.env.JWT_REFRESH_TOKEN,(err,user)=>{
                if(err) return res.status(401).send()
                const accessToken=generateAccessToken(JSON.parse(value))
                return res.status(200).send({accessToken:accessToken});
            })
        }
    })
})

function generateAccessToken(user){
    return jwt.sign(user,process.env.JWT_ACCESS_TOKEN,{expiresIn:'1h'}) // 1 hour
}
function generateRefreshToken(user){
    return jwt.sign(user,process.env.JWT_REFRESH_TOKEN)
}

module.exports=router
