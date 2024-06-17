const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require("jsonwebtoken");
const config = require('config');


const userSchema = new mongoose.Schema({
    name:{
        type: String,
        required: true,
        minlength:3,
        maxlength:15
    },
    email:{
        type:String,
        unique:true,
        required: true,
        minlength:3,
        maxlength:255
    },
    password:{
        type:String,
        required: true,
        minlength:3,
        maxlength:1024
    }

})
userSchema.methods.generateAuthToken = function(){
    const token = jwt.sign({_id:this._id},config.get('vidly_jwtPrivateKey'))
    return token
}


const User = mongoose.model("Users",userSchema)


function validateUser(user){
    const schema = Joi.object({
        name:Joi.string().required().max(50).min(3),
        email:Joi.string().required().email().max(255).min(3),
        password:Joi.string().required().max(1024).min(3)
    })
    return schema.validate(user)
}

exports.User = User
exports.validateUser = validateUser