const mongoose = require('mongoose')
const Joi = require('joi')

const customerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minLength: 4,
    maxLength: 50
  },
  phone: {
    type: String,
    required: true,
    minLength: 10,
    maxLength: 22
  },
  isGold: {
    type: Boolean,
    default: false
  }
})

const Customer = mongoose.model('Customer', customerSchema)

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(4).max(50).required(),
    phone: Joi.string().min(10).max(22).required(),
    isGold: Joi.boolean()
  }
  return Joi.validate(customer, schema)
}

module.exports = { Customer, validateCustomer }