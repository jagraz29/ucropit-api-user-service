const Joi = require('joi')
const mongoose = require('mongoose')

const rolSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 10
  },
  keyword: {
    type: String,
    required: true,
    maxLength: 10
  }
})

const Roles = mongoose.model('Roles', rolSchema)

exports.Roles = Roles