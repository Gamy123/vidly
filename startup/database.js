const mongoose = require('mongoose');
const logger = require ('../middleware/logger');
module.exports = function () 
    {mongoose.connect('mongodb://localhost/zanras')
    .then(() => logger.info('Connected to MongoDB...'));
}
