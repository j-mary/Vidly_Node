const express = require('express')
const router = express.Router()

const { Customer, validateCustomer } = require('../models/customer-model')

router.get('/', async (req, res) => {
  const customers = await Customer.find().sort('name')
  res.send(customers)
})

router.get('/:id', async (req, res) => {
  const customer = await Customer.findById(req.params.id)
  if(!customer) return res.status(404).send('The customer with given ID was not found')
  res.send(customer)
})

router.post('/', async (req, res) => {
  // validate user input
  const { error } = validateCustomer(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  // create new customer
  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  })
  // save & return customer
  customer = await customer.save()
  res.send(customer)
})

router.put('/:id', async (req, res) => {
  // validate user input
  const { error } = validateCustomer(req.body)
  if(error) return res.status(400).send(error.details[0].message)
  // update customer
  const customer = await Customer.findByIdAndUpdate(req.params.id, {
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold
  }, { new: true })
  if(!customer) return res.status(404).send('The customer with given ID was not found')
  // return updated customer
  res.send(customer)
})

router.delete('/:id', async (req, res) => {
  const customer = await Customer.findByIdAndRemove(req.params.id)
  if(!customer) return res.status(404).send('The customer with given ID was not found')
  res.send(customer)
})

module.exports = router