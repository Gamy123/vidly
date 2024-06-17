const mongoose = require('mongoose');
const express = require('express');
const Joi = require('joi');
const app = express();
const zanras = require('./routes/zanras')
const customers = require('./routes/customers')
const movies = require('./routes/movies')
const rentals = require('./routes/rentals')
const users = require("./routes/users.js")
Joi.objectId = require('joi-objectid')(Joi);
const auth = require('./routes/auth');
const config = require('config');

if (!config.get('vidly_jwtPrivateKey')){
    console.log('FATAL ERROR: jwtPrivateKey is not defined');
    process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/zanras',zanras)
app.use('/api/customers',customers)
app.use('/api/movies',movies)
app.use('/api/rentals',rentals)
app.use('/api/users',users)
app.use('/api/auth',auth)


mongoose.connect('mongodb://localhost/zanras')
    .then(() => console.log("Conneted to MongoDB"))
    .catch(err => console.error('Could not connect'))

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));


// course 109