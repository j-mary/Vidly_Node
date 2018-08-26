const auth = require('../middleware/auth')
const { Rental, validateRental } = require('../models/rental-model')
const { Movie } = require('../models/movie-model')
const { Customer } = require('../models/customer-model')
const mongoose = require('mongoose')
const Fawn = require('fawn')
const express = require('express')
const router = express.Router()

Fawn.init(mongoose)

router.get('/', async (req, res) => {
  const rentals = await Rental.find().sort('-dateOut')
  res.send(rentals)
});

router.get('/:id', async (req, res) => {
  const rental = await Rental.findById(req.params.id)
  if (!rental) return res.status(404).send('The rental with the given ID was not found.')
  res.send(rental);
});

router.post('/', auth, async (req, res) => {
  // validate input
  const { error } = validateRental(req.body); 
  if (error) return res.status(400).send(error.details[0].message)
  // get customer
  const customer = await Customer.findById(req.body.customerId)
  if (!customer) return res.status(400).send('Invalid customer.')
  // get movie
  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send('Invalid movie.')
  // check if movie is in stock
  if (movie.numberInStock === 0) return res.status(400).send('Movie not in stock.')
  // create new rental
  const rental = new Rental({ 
    customer: {
      _id: customer._id,
      isGold: customer.isGold,
      name: customer.name, 
      phone: customer.phone
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate
    }
  })

  try {
    // save created rental & reduce number of movies in stock by mimicking a 'transaction'
    new Fawn.Task()
      .save('rentals', rental)
      .update('movies', {_id: movie._id}, {
        $inc: {numberInStock: -1}
      })
      .run()
    res.send(rental)
  } 
  catch (ex) {
    res.status(500).send(ex.message)
  }
});

module.exports = router; 
