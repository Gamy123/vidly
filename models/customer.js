const mongoose = require('mongoose');
const Joi = require('joi');

const Customer = mongoose.model('Customer', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 50
    },
    phone: {
        type: String,
        required: true,
        minlength: 3,
        maxlength: 20
    },
    isGold: {
        type: Boolean,
        default: false,
        required: true
    }
}));

function validateCustomer(customer) {
    const schema = Joi.object({
        name: Joi.string().min(3).required().max(50),
        phone: Joi.string().required(),
        isGold: Joi.boolean(),
    });
    return schema.validate(customer);
}

exports.Customer = Customer;
exports.validate = validateCustomer;