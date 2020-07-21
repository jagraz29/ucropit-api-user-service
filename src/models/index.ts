import mongoose from 'mongoose'
import User from './user'

const connectDb = function () {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

const models = { User }

export { connectDb }

export default models
