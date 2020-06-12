const {logger, handleRejections} = require('./startup/logging');
const debug = require('debug')('app:index');
const express = require('express');
const app = express();

handleRejections();
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);
require('./startup/routes')(app);

const port = process.env.PORT || 3001;
app.listen(port, () => logger.info(`Listening on port ${port}...`));
console.log(`Listening on port ${port}...`);

module.exports = app;
