const _ = require('lodash')
const bcrypt = require('bcrypt')
const express = require('express')
const router = express.Router()

const { User, validateUser } = require('../models/user-model')

router.post('/', async (req, res) => {
  // validate user input
  const { error } = validateUser(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  // check if user already exists
  let user = await User.findOne({ email: req.body.email })
  if (user) return res.status(400).send('User already registered')
  // else -> create new user
  user = new User(_.pick(req.body, ['name', 'email', 'password']))
  // hash password
  const salt = await bcrypt.genSalt(10)
  user.password = await bcrypt.hash(user.password, salt)
  // save & return user with token
  await user.save()
  const token = user.generateAuthToken()
  res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']))
})

module.exports = router