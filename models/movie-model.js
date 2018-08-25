const mongoose = require('mongoose')
const Joi = require('joi')
const { genreSchema } = require('./genre-model')

const movieSchema = new mongoose.Schema({
  title: {
    type: String,
    trim: true,
    required: true,
    minlength: 3,
    maxlength: 120
  },
  genre: {
    type: genreSchema,
    required: true
  },
  numberInStock: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  },
  dailyRentalRate: {
    type: Number,
    required: true,
    min: 0,
    max: 255
  }
})

const Movie = mongoose.model('Movie', movieSchema)

function validateMovie(movie) {
  const schema = {
    title: Joi.string().min(3).max(120).required(),
    genreId: Joi.string().required(),
    numberInStock: Joi.number().min(0).required(),
    dailyRentalRate: Joi.number().min(0).required()
  }
  return Joi.validate(movie, schema)
}

module.exports = { Movie, validateMovie }