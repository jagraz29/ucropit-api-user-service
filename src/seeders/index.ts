require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { cropTypes, unitTypes } from './data'

const CropType = models.CropType
const UnitType = models.UnitType

/**
 * Seeders CropType
 */
const seedersCropType = async () => {
  console.log(`${chalk.green('=====Registrando CropTypes====')}`)

  await CropType.deleteMany({})

  for await (const cropType of cropTypes) {
    CropType.create(cropType)
  }
  console.log(`${chalk.green('=====CropTypes Registrados====')}`)
}

/**
 * Seeder UnitType
 */
const seedersUnitType = async () => {
  console.log(`${chalk.green('=====Registrando UnitType====')}`)

  await UnitType.deleteMany({})

  for await (const unitType of unitTypes) {
    UnitType.create(unitType)
  }
  console.log(`${chalk.green('=====UnitTypes Registrados====')}`)
}

(() => {
  connectDb().then(async () => {
    await seedersCropType()
    await seedersUnitType()
  })
})()
