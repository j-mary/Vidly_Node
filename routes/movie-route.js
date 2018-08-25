const express = require('express')
const router = express.Router()

const { Movie, validateMovie } = require('../models/movie-model')
const { Genre } = require('../models/genre-model')

router.get('/', async (req, res) => {
  const movies = await Movie.find().sort('title')
  res.send(movies)
})

router.get('/:id', async (req, res) => {
  const movie = await Movie.findById(req.params.id)
  res.send(movie)
})

router.post('/', async (req, res) => {
  // validate input
  const { error } = validateMovie(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // get genre
  const genre = await Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send('Invalid genre')
  // create new movie
  let movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  })
  // save & return
  movie = await movie.save()
  res.send(movie)
})

router.put('/:id', async (req, res) => {
  // validate input
  const { error } = validateMovie(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // get genre
  const genre = Genre.findById(req.body.genreId)
  if (!genre) return res.status(400).send('Invalid genre')
  // update movie
  const movie = Movie.findByIdAndUpdate(req.params.id, {
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name
    },
    numberInStock: req.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate
  }, {new: true})
  // return updated movie
  if(!movie) return res.status(404).send('The movie with given ID was not found')
  res.send(movie)
})

router.delete('/:id', async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id)
  if(!movie) return res.status(404).send('The movie with given ID was not found')
  res.send(movie)
})

module.exports = router