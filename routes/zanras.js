const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const {Zanra,validateZanra} = require('../models/zanra');
const auth_mw = require("../middleware/auth-mw")
const admin = require("../middleware/admin")

router.get('/',async(req, res,next) => {
    const zanras = await Zanra.find().sort('name');
    res.send(zanras);
});

router.get('/:id', async(req, res) => {
    let zanra = await Zanra.findById(req.params.id);
    if (!zanra) {
        return res.status(404).send("The zanra with the given ID was not found.");
    }
    res.send(zanra);
});

router.post('/',auth_mw, async(req, res) => {
    const { error } = validateZanra(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let zanra = new Zanra(req.body);
    const result = await zanra.save();
    res.send(result);
});

router.put('/:id', async(req, res) => {
    const { error } = validateZanra(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    let zanra = await Zanra.findByIdAndUpdate(req.params.id, {name: req.body.name}, {new: true});
    if (!zanra) {
        return res.status(404).send("The zanra with the given ID was not found.");
    }
    res.send(zanra);
});

router.delete('/:id',[auth_mw,admin], async(req, res) => {
    let zanra = await Zanra.findByIdAndDelete(req.params.id);
    if (!zanra) {
        return res.status(404).send("The zanra with the given ID was not found.");
    }
    res.send(zanra);
});

module.exports=router;