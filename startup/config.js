
const config = require('config');
const logger = require('../middleware/logger');
module.exports = function () {if (!config.get('vidly_jwtPrivateKey')) {
    throw new Error('FATAL ERROR: jwtPrivateKey is not defined');
  }}