import mongoose from 'mongoose'
import User from './user'
import Lot from './lot'
import Crop from './crop'
import Company from './company'

import { CropType } from './cropType'
import { UnitType } from './unitType'

const connectDb = function () {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

const models = { User, Lot, Crop, Company, CropType, UnitType }

export { connectDb }

export default models
