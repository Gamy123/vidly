const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const {User,validateUser} = require('../models/user');
const _ = require('lodash');
const bcrypt = require('bcrypt');


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
    if (error){
        return res.status(400).send(error.details[0].message);
    }

    const userVer = await User.findOne({email: req.body.email});
    if (userVer){
        return res.send("Email is already registered");
    }
    let user = await new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);

    user.generateAuthToken()

    await user.save();

    const token = user.generateAuthToken()

    res.header("x-auth-token",token).send(_.pick(user, ["_id", "name", "email"]))
});

router.put("/:id", async (req, res) => {
    try {
        var hashedPassword = passwordHash.generate(req.body.password);
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


module.exports = router