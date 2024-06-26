const zanras = require('../routes/zanras');
const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const error = require('../middleware/error');
const express = require('express');


module.exports = function(app){
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/zanras', zanras);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error); 
}