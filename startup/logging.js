const logger = require('../middleware/logger');
require("express-async-errors");
module.exports = function(){process.on('uncaughtException', (ex) => {
    logger.error(ex.message, ex);
    setTimeout(() => {
      logger.info('Shutting down due to uncaught exception...');
      process.exit(1);
    }, 1000);
  });
  
  
  process.on('unhandledRejection', (err) => {
    logger.error(err.message, err);
    setTimeout(() => {
      logger.info('Shutting down due to unhandled rejection...');
      process.exit(1);
    }, 1000);
  });}