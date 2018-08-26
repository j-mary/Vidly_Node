const _ = require('lodash')
const Joi = require('joi')
const bcrypt = require('bcrypt')
const { User } = require('../models/user-model')
const express = require('express')
const router = express.Router()

router.post('/', async (req, res) => {
  // validate user input
  const { error } = validateRequest(req.body)
  if (error) return res.status(400).send(error.details[0].message)
  // check if user exists via email
  const user = await User.findOne({ email: req.body.email })
  if (!user) return res.status(400).send('Invalid email or password')
  // validate user password
  const validPassword = await bcrypt.compare(req.body.password, user.password)
  if (!validPassword) return res.status(400).send('Invalid email or password')
  // if all went well, return true
  res.send(true)
})

function validateRequest(req) {
  const schema = {
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(6).max(255).required()
  }

  return Joi.validate(req, schema)
}

module.exports = router