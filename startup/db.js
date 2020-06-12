const debug = require('debug')('app:db');
const mongoose = require('mongoose');
const config = require('config');

module.exports = function() {
    const db = config.get('db');
    console.log("db should be - ", db);
    console.log("jwt should be - ", config.get('jwtPrivateKey'));
    mongoose.connect(db, {
        useNewUrlParser: true,
        useCreateIndex: true,
        useUnifiedTopology: true,
        useFindAndModify: false
    })
        .then(() => console.log(`Connected to ${db}...`));
}
