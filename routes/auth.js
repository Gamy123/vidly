const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const {User} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');


router.get("/",async(req,res)=>{
    const user = await User.find().sort('name')
    if (user.length === 0){
        return res.send("No users recorded");
    }
    res.send(user);
});

router.get("/:id",async(req,res)=>{
    try{
        const user = await User.findById(req.params.id);
        if (!user){
            return res.status(404).send("The user with the given ID was not found.");
        }
        res.send(user);
    } catch (error) {
        return res.status(400).send("Inncorect ID format");
    }
});

router.post("/",async(req,res)=>{
    const {error} = validateUser(req.body);
    if (error){return res.status(400).send(error.details[0].message);}

    let user = await User.findOne({email: req.body.email});
    if (!user){return res.status(400).send("Invalid email or password.")}
    
    const validPassword = await bcrypt.compare(req.body.password, user.password)
    if (!validPassword){return res.status(400).send("Invalid email or password.")}

    const token =user.generateAuthToken()
    res.send(token);
});

router.put("/:id", async (req, res) => {
    try {
        const { error } = validateUser(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let user = await User.findByIdAndUpdate(
            req.params.id, 
            {
                name: req.body.name,
                email: req.body.email,
                password: hashedPassword
            }, 
            { new: true }
        );
        if (!user) {
            return res.status(404).send("User with the given ID was not found.");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("Invalid ID format or other error occurred.");
    }
});

router.delete("/:id",async(req,res)=>{
    try{
        let user = await User.findByIdAndDelete(req.params.id);
        if (!user) {
            return res.status(404).send("User with the given ID was not found.");
        }
        res.send(user);
    } catch (err) {
        res.status(400).send("Invalid ID format or other error occurred.");
    }
});

function validateUser(req){
    const schema = Joi.object({
        email:Joi.string().required().email().max(255).min(3),
        password:Joi.string().required().max(1024).min(3)
    })
    return schema.validate(req)
}


module.exports = router