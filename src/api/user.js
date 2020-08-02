const express = require('express');
const monk = require('monk'); //Mongo Db Driver
const Joi = require('@hapi/joi')

const db=monk(process.env.MONGO_URI)
const users=db.get('users') // Get Collection


//Validate Control
const schema=Joi.object({
    name: Joi.string().trim().required(),
    email: Joi.string().trim().required(),
    password: Joi.string().trim().required(),
});

const router=express.Router()

// Read All
router.get('/', async (req,res,next)=>{
    try {
        const items=await users.find({});
        res.json(items);
    } catch (error) {
        next(error);
    }
})

// Read One
router.get('/:id', async (req,res,next)=>{
    try {
        const {id} =req.params;
        const item= await users.findOne({
            _id: id,
        });
        if(!item) 
            return next();
        return res.json(item);
    } catch (error) {
        next(error);
    }
})
// Create All
router.post('/', async (req,res,next)=>{
    try {
        const value = await schema.validateAsync(req.body);
        const inserted = await users.insert(req.body);
        res.json(inserted);
    } catch (error) {
        next(error);
    }
})
// Update All
router.put('/:id', async (req,res,next)=>{
    try {
        const {id} =req.params;
        const value = await schema.validateAsync(req.body);
        const item= await users.findOne({
            _id: id,
        });
        if(!item) 
            return next();
        await users.update({_id:id},{$set : req.body});
        res.json(value);
    } catch (error) {
        next(error);
    }
})
// Delete All
router.delete('/:id', async (req,res,next)=>{
    try {
        const {id}=req.params;
        await users.remove({ _id : id });
        res.json({
            message:'Deleted Success'
        });
    } catch (error) {
        
    }
})
module.exports=router