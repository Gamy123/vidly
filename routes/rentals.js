const express = require('express');
const router = express.Router();
const Joi = require('joi');
const mongoose = require('mongoose');
const {Rental,validateRental} = require('../models/rental');
const {Customer} = require('../models/customer');
const {Movie} = require('../models/movie');

router.get('/', async (req, res) => {
    try {
        const rental = await Rental.find().sort('-dateOut');
        if (rental.length === 0) {
            return res.send('No instances');
        }
        res.send(rental);
    } catch (error) {
        return res.status(500).send('Server error');
    }
});

router.post('/', async (req, res) => {
    try {
        const { error } = validateRental(req.body);
        if (error) {
            return res.status(400).send(error.details[0].message);
        }

        const customer = await Customer.findById(req.body.customerId);
        if (!customer) {
            return res.status(400).send('Invalid customer.');
        }

        const movie = await Movie.findById(req.body.movieId);
        if (!movie) {
            return res.status(400).send('Invalid movie.');
        }

        if (movie.numberInStock === 0) {
            return res.status(400).send('Movie not in stock.');
        }

        const session = await mongoose.startSession();
        session.startTransaction();

        try {
            const rental = new Rental({
                customer: {
                    _id: customer._id,
                    name: customer.name,
                    phone: customer.phone
                },
                movie: {
                    _id: movie._id,
                    title: movie.title,
                    dailyRentalRate: movie.dailyRentalRate,
                    numberInStock: movie.numberInStock
                }
            });

            const result = await rental.save();
            movie.numberInStock--;
            await movie.save();
            await session.commitTransaction();
            session.endSession();
            res.send(result);

        } catch (error) {
            await session.abortTransaction();
            session.endSession();
            console.log(error.message);
            return res.status(500).send('Server error');
        }
    } catch (error) {
        return res.status(500).send('Server error');
    }
});
module.exports = router;
