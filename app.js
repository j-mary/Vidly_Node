const Joi = require('joi')
Joi.objectId = require('joi-objectid')(Joi)
const mongoose = require('mongoose')
const genres = require('./routes/genre-route')
const customers = require('./routes/customer-route')
const movies = require('./routes/movie-route')
const rentals = require('./routes/rental-route')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost:27017/vidly', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('Failed to connect to MongoDB'))

app.use(express.json())
app.use('/api/genres', genres)
app.use('/api/customers', customers)
app.use('/api/movies', movies)
app.use('/api/rentals', rentals)

app.get('/', (req, res) => {
  res.send('Vidly')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}...`))