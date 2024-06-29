const express = require('express');
const logger = require('./middleware/logger');
const app = express();

require('./startup/logging')(logger)
require("./startup/config")()
require('./startup/routes')(app)
require('./startup/database')(logger)
require('./startup/validation')()

const port = process.env.PORT || 3000;
app.listen(port, () => logger.info(`Listening on port ${port}...`));