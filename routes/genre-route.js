const auth = require('../middleware/auth')
const admin = require('../middleware/admin')
const express = require('express')
const router = express.Router()

const { Genre, validateGenre } = require('../models/genre-model')

router.get('/', async (req, res) => {
  const genres = await Genre.find().sort('name')
  res.send(genres)
})

router.get('/:id', async (req, res) => {
  const genre = await Genre.findById(req.params.id)
  if(!genre) return res.status(404).send('The genre with given ID was not found')
  res.send(genre)
})

router.post('/', auth, async (req, res) => {
  // validate input
  const {error} = validateGenre(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  // create new genre
  const genre = new Genre({ name: req.body.name })
  // save & return
  await genre.save()
  res.send(genre)
})

router.put('/:id', auth, async (req, res) => {
  // validate input
  const {error} = validateGenre(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  // update genre
  const genre = await Genre.findByIdAndUpdate(req.params.id, { name: req.body.name }, { new: true })
  if(!genre) return res.status(404).send('The genre with given ID was not found')
  // return updated genre
  res.send(genre)
})

router.delete('/:id', [auth, admin], async (req, res) => {
  const genre = await Genre.findByIdAndRemove(req.params.id)
  if(!genre) return res.status(404).send('The genre with given ID was not found')
  res.send(genre)
})

module.exports = router