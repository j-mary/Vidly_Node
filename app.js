const mongoose = require('mongoose')
const express = require('express')
const app = express()

mongoose.connect('mongodb://localhost:27017/vidly', {useNewUrlParser: true})
  .then(() => console.log('MongoDB Connected...'))
  .catch(err => console.error('Failed to connect to MongoDB'))

app.get('/', (req, res) => {
  res.send('Vidly')
})

const port = process.env.PORT || 3000
app.listen(port, () => console.log(`Server running on port ${port}...`))