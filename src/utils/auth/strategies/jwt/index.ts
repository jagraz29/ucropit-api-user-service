require('dotenv').config()
const passport = require('passport')
const passportJWT = require('passport-jwt')
const JWTStrategy = passportJWT.Strategy
const ExtractJWT = passportJWT.ExtractJwt

import models from '../../../../models'

const User = models.User

const optsUser = {
  jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.AUTH_KEY_JWT
}

const strategy = new JWTStrategy(optsUser, async (payload, next) => {
  try {
    const user = await User.findById(payload.id)
    next(null, user)
  } catch (error) {
    console.log(error)
  }
})

passport.use(strategy)

export default passport
