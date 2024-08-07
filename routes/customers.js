const {Customer, validate} = require('../models/customer');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

router.get('/', async (req, res) => {
        const customers = await Customer.find().sort('_id');
        res.send(customers);
});

router.get('/:id', async (req, res) => {
        let customer = await Customer.findById(req.params.id);
        if (!customer) {
            return res.status(404).send("The customer with the given ID was not found.");
        }
        res.send(customer);
});

router.put('/:id', async (req, res) => {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let customer = await Customer.findByIdAndUpdate(req.params.id, {
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        }, { new: true });
        if (!customer) {
            return res.status(404).send("The customer with the given ID was not found.");
        }
        res.send(customer);
});



router.post('/', async (req, res) => {
        const { error } = validate(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }
        let customer = new Customer({
            _id: req.body._id,
            name: req.body.name,
            phone: req.body.phone,
            isGold: req.body.isGold
        });
        customer = await customer.save();
        res.send(customer);
    });



router.delete('/:id', async (req, res) => {
        let customer = await Customer.findByIdAndRemove(req.params.id);
        if (!customer) {
            return res.status(404).send("The customer with the given ID was not found.");
        }
        res.send(customer);
});


module.exports = router;
