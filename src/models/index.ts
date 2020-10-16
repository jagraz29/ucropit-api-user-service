import mongoose from 'mongoose'
import User from './user'
import Lot from './lot'
import Crop from './crop'
import Company from './company'
import UserConfig from './userConfig'
import Supplies from './supplies'
import ActivityType from './activityType'
import TypeAgreement from './typeAgreement'
import Activity from './activity'
import Achievement from './achievement'
import CollaboratorRequest from './collaboratorRequest'

import { CropType } from './cropType'
import { UnitType } from './unitType'

import FileDocument from './documentFile'

const connectDb = function () {
  return mongoose.connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
}

const models = {
  User,
  Lot,
  Crop,
  Company,
  CropType,
  UnitType,
  UserConfig,
  FileDocument,
  Supplies,
  TypeAgreement,
  ActivityType,
  Activity,
  Achievement,
  CollaboratorRequest
}

export { connectDb }

export default models
