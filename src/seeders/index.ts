require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import {
  cropTypesData,
  unitTypesData,
  activitiesTypesData,
  agreementTypesData
} from './data'

const CropType = models.CropType
const UnitType = models.UnitType
const ActivityType = models.ActivityType
const TypeAgreement = models.TypeAgreement

const CollaboratorRequest = models.CollaboratorRequest

/**
 * Seeders CropType
 */
const seedersCropType = async () => {
  console.log(`${chalk.green('=====Registering CropTypes====')}`)

  const cropTypes = await CropType.find({})

  const cropTypesSeed = cropTypesData.filter(
    (item) => !cropTypes.find((element) => item.key === element.key)
  )

  for (const cropType of cropTypesSeed) {
    await CropType.create(cropType)
  }
  console.log(`${chalk.green('=====Registered CropTypes====')}`)
  return true
}

/**
 * Seeder UnitType
 */
const seedersUnitType = async () => {
  console.log(`${chalk.green('=====Registering UnitType====')}`)

  const unitTypes = await UnitType.find({})

  const unitTypeSeed = unitTypesData.filter(
    (item) => !unitTypes.find((element) => item.key === element.key)
  )

  for (const unitType of unitTypeSeed) {
    await UnitType.create(unitType)
  }

  console.log(`${chalk.green('=====Registered UnitType====')}`)
  return true
}

const seedersActivitiesType = async () => {
  console.log(`${chalk.green('=====Registering ActivityType====')}`)

  const activities = await ActivityType.find({})

  const activityTypeSeed = activitiesTypesData.filter(
    (item) => !activities.find((element) => item.tag === element.tag)
  )

  for (const activityType of activityTypeSeed) {
    await ActivityType.create(activityType)
  }

  console.log(`${chalk.green('=====Registered ActivityType====')}`)
  return true
}

const seedersTypeAgreement = async () => {
  console.log(`${chalk.green('=====Registering TypeAgreement====')}`)

  const agreementTypes = await TypeAgreement.find({})

  const agreementTypeSeed = agreementTypesData.filter(
    (item) => !agreementTypes.find((element) => item.key === element.key)
  )

  for (const agreementType of agreementTypeSeed) {
    await TypeAgreement.create(agreementType)
  }

  console.log(`${chalk.green('=====Registered TypeAgreement====')}`)
  return true
}

const dropAllDatabase = (connected) => {
  return connected.connection.db.dropDatabase()
}

(async () => {
  const connected = await connectDb()

  if (connected) {
    if (process.argv[2] && process.argv[2] === '--reset') {
      console.log(`${chalk.green('=====Clean all DataBase ====')}`)
      dropAllDatabase(connected)
      console.log(`${chalk.green('=====Reset DataBase ====')}`)
    }

    await seedersUnitType()
    await seedersCropType()
    await seedersActivitiesType()
    await seedersTypeAgreement()
  }
  process.exit()
})()
