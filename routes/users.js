const _ = require('lodash');
const bcrypt = require('bcrypt');
const {User, validate, validatePassword} = require('../models/user');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/me', auth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    if (!user) return res.status(404).send('The genre with the given ID was not found.');

    res.send(user);
});

router.post('/', async (req, res) => {
    const validation = validate(req.body);
    if (validation.error) return res.status(400).send(validation.error.details[0].message);

    const passwordValidation = validatePassword(req.body.password);
    if (passwordValidation.error) return res.status(400).send(passwordValidation.error.details[0].message);

    let user = await User.findOne({email: req.body.email});
    if (user) return res.status(400).send("User already registered");

    user = new User(_.pick(req.body, ["name", "email", "password"]));
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
    user = await user.save();

    const token = user.generateAuthToken();
    res.header('x-auth-token', token).send(_.pick(user, ["name", "email"]));
});

router.put('/:id', auth, async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User
        .findByIdAndUpdate(req.params.id,
        {
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
        },
        { new: true });

    if (!user) return res.status(404).send('The genre with the given ID was not found.');

    res.send(user);
});

router.delete('/delete_me', auth, async (req, res) => {
    const user = await User.findByIdAndRemove(req.user._id);

    if (!user) return res.status(404).send('The user with the given ID was not found.');

    res.send(user);
});

module.exports = router;