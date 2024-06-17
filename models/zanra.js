const mongoose = require('mongoose');
const Joi = require('joi');

const zanraSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    }
});

const Zanra = mongoose.model('Zanra', zanraSchema);

function validateZanra(zanra) {
    const schema = Joi.object({
    name: Joi.string().min(3).max(50).required()
    });
    return schema.validate(zanra);
}

exports.Zanra = Zanra;
exports.validateZanra = validateZanra;
exports.zanraSchema = zanraSchema;
