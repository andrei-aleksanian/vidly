const {logger} = require('../startup/logging');

module.exports = function(ex, req, res, next) {
    logger.log('error', ex.message, ex);
    return res.status(500).send('Something failed.');
}
