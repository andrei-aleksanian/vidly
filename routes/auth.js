const _ = require('lodash');
const Joi = require('joi');
const bcrypt = require('bcrypt');
const {User, validatePassword} = require('../models/user');
const express = require('express');
const router = express.Router();
const {logger} = require('../startup/logging');

router.post('/', async (req, res) => {
    const validation = validate(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);

    const passwordValidation = validatePassword(req.body.password);
    if (passwordValidation.error) return res.status(400).send("Invalid email or password");

    const user = await User.findOne({email: req.body.email});
    if (!user) return res.status(400).send("Invalid email or password");

    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if (!validPassword) return res.status(400).send("Invalid email or password");

    logger.log('info', 'user logged in', _.pick(user, ["name", "email"]));
    const token = user.generateAuthToken();
    res.send(token);
});

function validate(auth) {
    const schema = {
        email: Joi.string().min(5).max(255).required().email(),
        password: Joi.string().min(5).max(1024).required()
    };

    return Joi.validate(auth, schema);
}

module.exports = router;