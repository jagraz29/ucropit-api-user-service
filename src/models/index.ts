import mongoose from 'mongoose'
import User from './user'
import Lot from './lot'
import Crop from './crop'
import Company from './company'
import UserConfig from './userConfig'
import ActivityType from './activityType'
import TypeAgreement from './typeAgreement'
import Activity from './activity'
import Achievement from './achievement'
import CollaboratorRequest from './collaboratorRequest'
import ApprovalRegisterSign from './ApprovalRegisterSign'
import Supply from './Supply'
import SupplyType from './SupplyType'

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
  TypeAgreement,
  ActivityType,
  Activity,
  Achievement,
  CollaboratorRequest,
  ApprovalRegisterSign,
  Supply,
  SupplyType
}

export { connectDb }

export default models
