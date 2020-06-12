const {logger, handleRejections} = require('./startup/logging');
const config = require('config');
const express = require('express');
const app = express();

handleRejections();
require('./startup/config')();
require('./startup/db')();
require('./startup/prod')(app);
require('./startup/routes')(app);

if(config.get('db') === 'mongodb://localhost/vidly') {
    const port = process.env.PORT || 3001;
    app.listen(port, () => logger.info(`Listening on port ${port}...`));
}

module.exports = app;
