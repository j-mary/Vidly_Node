const mongoose = require('mongoose')
const genres = require('./routes/genre-route')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost:27017/vidly', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('Failed to connect to MongoDB'))

app.use(express.json())
app.use('/api/genres', genres)

app.get('/', (req, res) => {
  res.send('Vidly')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}...`))