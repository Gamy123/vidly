const mongoose = require('mongoose');
const Joi = require('joi');
const {Zanra,validate,zanraSchema} = require('./zanra');
const joiObjectid = require('joi-objectid');


const Movie = mongoose.model('Movie', new mongoose.Schema({
    title:{
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50,
        trim:true
    },
    genreId: {
        type: zanraSchema,
        required:true
      },
    numberInStock: {
        type: Number,
        min: 0,
        max: 255
    },
    dailyRentalRate: {
        type: Number,
        min: 0,
        max: 255
    }
}));


function validateMovie(movie) {
    const schema = Joi.object({
        title:Joi.string().min(3).required(),
        genreId: Joi.objectId().required(),
        numberInStock: Joi.number().min(0).max(255),
        dailyRentalRate: Joi.number().min(0).max(255)
    })
    return schema.validate(movie);
}

exports.validate = validateMovie;
exports.Movie =  Movie