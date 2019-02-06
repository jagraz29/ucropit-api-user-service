const Joi = require('joi')
const jwt = require('jsonwebtoken') 
const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
  firstname: {
    type: String,
    required: true,
    maxlength: 50
  },
  lastname: {
    type: String,
    required: true,
    maxlength: 50
  },
  phone: {
    type: String,
    required: true,
    maxlength: 50
  },
  fiscal_id: { // bussines identificator
    type: String,
    required: false,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6,
    maxlength: 1024,
  }
})

userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ _id: this._id }, process.env.APP_SECRET)
}

const User = mongoose.model('User', userSchema)

function validateUser(user) {
  const schema = {
    firstname: Joi.string().max(50).required(),
    lastname: Joi.string().max(50).required(),
    email: Joi.string().min(5).max(255).required().email(),
    phone: Joi.string().min(5).max(255).required(),
    password: Joi.string().min(6).max(1024).required()
  }

  return Joi.validate(user, schema)
}

exports.User = User
exports.validate = validateUser