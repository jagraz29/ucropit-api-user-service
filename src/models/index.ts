import mongoose from 'mongoose'
import User from './user'
import Lot from './lot'

const connectDb = function () {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

const models = { User, Lot }

export { connectDb }

export default models
