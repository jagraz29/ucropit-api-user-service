require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { cropTypesData, unitTypesData } from './data'

const CropType = models.CropType
const UnitType = models.UnitType

/**
 * Seeders CropType
 */
const seedersCropType = async () => {
  console.log(`${chalk.green('=====Registering CropTypes====')}`)

  const cropTypes = await CropType.find({})

  const cropTypesSeed = cropTypesData.filter(
    (item) => !cropTypes.find((element) => item.name === element.name)
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
    (item) => !unitTypes.find((element) => item.name === element.name)
  )

  for (const unitType of unitTypeSeed) {
    await UnitType.create(unitType)
  }

  console.log(`${chalk.green('=====Registered UnitType====')}`)
  return true
}

(async () => {
  const connected = await connectDb()

  if (connected) {
    await seedersUnitType()
    await seedersCropType()
  }
  process.exit()
})()
