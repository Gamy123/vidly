const mongoose = require('mongoose');
require("express-async-errors");
const express = require('express');
const Joi = require('joi');
const config = require('config');
const error = require('./middleware/error');
const logger = require('./middleware/logger'); // Import the Pino logger
const app = express();
const zanras = require('./routes/zanras');
const customers = require('./routes/customers');
const movies = require('./routes/movies');
const rentals = require('./routes/rentals');
const users = require('./routes/users');
const auth = require('./routes/auth');
Joi.objectId = require('joi-objectid')(Joi);

if (!config.get('vidly_jwtPrivateKey')) {
  logger.error("FATAL ERROR: jwtPrivateKey is not defined");
  process.exit(1);
}

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/api/zanras', zanras);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/rentals', rentals);
app.use('/api/users', users);
app.use('/api/auth', auth);
app.use(error);

mongoose.connect('mongodb://localhost/zanras')
  .then(() => logger.info("Connected to MongoDB"))
  .catch(err => {
    logger.error('Could not connect to MongoDB', err);
    Runtime.getRuntime().halt();
  });

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
