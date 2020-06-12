const config = require('config');
const debug = require('debug')("app:startup");

module.exports = function() {
    if (!config.get("jwtPrivateKey")) {
        debug('FATAL ERROR: environment variables are not set, - ', "jwtPrivateKey");
        process.exit(1);
    }
}