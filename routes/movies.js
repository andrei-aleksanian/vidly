const {Movie, validate} = require('../models/movie');
const {Genre} = require('../models/genre');
const express = require('express');
const router = express.Router();

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('name');
  res.send(movies);
});

router.post('/', async (req, res) => {
  const data = req.body;
  const { error } = validate(data);
  if (error) return res.status(400).send(error.details);

  const genre = await Genre.findById(data.genreId);
  console.log("found", genre);
  if (!genre) return res.status(400).send("Invalid Genre");

  const movie = new Movie({
    title: data.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: data.numberInStock,
    dailyRentalRate: data.dailyRentalRate
  });
  const result = await movie.save();
  
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