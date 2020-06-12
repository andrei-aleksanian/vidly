const {Rental, validateReturn} = require('../models/rental');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.post('/', auth, async (req, res) => {
    const data = req.body;
    const { error } = validateReturn(data);
    if (error) return res.status(400).send(error.details);

    const rental = await Rental.findById(data.rentalId);
    if (!rental) return res.status(404).send("Rental does not exist");
    if (rental.returnedDate) return res.status(400).send("Rental is already returned");

    rental.returnedDate = new Date();
    await rental.save();

    res.status(200).send(rental);
});

module.exports = router;