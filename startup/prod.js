const express = require('express');
const logger = require('morgan');
const helmet = require('helmet');
const compression = require('compression');

module.exports = function(app) {
    app.use(helmet());
    app.use(compression());
    app.use(logger('dev'));
    app.use(express.json());
    app.use(express.urlencoded({extended: true}));
}