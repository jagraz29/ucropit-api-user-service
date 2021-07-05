import { connect } from 'mongoose'
import User from './user'
import Lot from './lot'
import Crop from './crop'
import Company from './company'
import UserConfig from './userConfig'
import ActivityType from './activityType'
import TypeAgreement from './typeAgreement'
import Activity from './activity'
import CollaboratorRequest from './collaboratorRequest'
import ApprovalRegisterSign from './ApprovalRegisterSign'
import Supply from './supply'
import SupplyType from './supplyType'
import EvidenceConcept from './evidenceConcept'
import ServiceIntegration from './serviceIntegration'
import Roles from './Roles'
import { CropType } from './cropType'
import { UnitType } from './unitType'
import TypeStorage from './typeStorage'
import Notification from './notification'
import FileDocument from './documentFile'
import IntegrationLog from './integrationLog'
import ActiveIngredient from './activeIngredient'
import ForeignCredential from './foreignCredential'
import Badge from './badge'
import Country from './country'

const connectDb = function () {
  return connect(process.env.DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false
  })
}

export * from './eiqRanges'
export * from './achievement'
export * from './envImpactIndice'

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
  CollaboratorRequest,
  ApprovalRegisterSign,
  Supply,
  SupplyType,
  EvidenceConcept,
  ServiceIntegration,
  Roles,
  IntegrationLog,
  TypeStorage,
  Notification,
  ActiveIngredient,
  ForeignCredential,
  Badge,
  Country
}

export { connectDb }

export default models
