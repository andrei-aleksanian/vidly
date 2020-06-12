const {Rental, validate} = require('../models/rental');
const {Movie} = require('../models/movie');
const {Customer} = require('../models/customer');
const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('movie.title');
  res.send(rentals);
});

router.post('/', auth, async (req, res) => {
  const data = req.body;
  const { error } = validate(data);
  if (error) return res.status(400).send(error.details);

  const movie = await Movie.findById(data.movieId);
  if (!movie) return res.status(400).send("Invalid Movie Id");

  const customer = await Customer.findById(data.customerId);
  if (!customer) return res.status(400).send("Invalid Customer Id");

  const rental = new Rental({
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    },
    customer: {
      _id: customer._id,
      name:customer.name,
      isGold: customer.isGold,
      phone: customer.phone
    },
    dueToBeReturned: Date.now(),
  });
  const result = await rental.save();
  
  res.send(result);
});

router.put('/:id', async (req, res) => {
  const data = req.body;
  const { error } = validate(data);
  if (error) return res.status(400).send(error.details[0].message);

  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The customer with the given ID was not found.');

  const genre = await Genre.findById(data.genreId);
  if (!genre) return res.status(400).send("Invalid Genre");

  movie.set({
    title: data.title,
    genre: genre,
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate
  });

  const result = await movie.save();
  res.send(result);
});

router.delete('/:id', async (req, res) => {
  const id = req.params.id;
  const movie = await Movie.findById(id);
  if (!movie) return "Data not found in our database";
  const result =  await Movie.deleteOne({_id: id});
  res.send(result);
});

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id);

  if (!movie) return res.status(404).send('The customer with the given ID was not found.');

  res.send(movie);
});

module.exports = router; 