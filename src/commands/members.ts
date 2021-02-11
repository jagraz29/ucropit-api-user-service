require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
const Crop = models.Crop

const addNewMembersInCrops = async () => {
  //   let crops = await Crop.find({ cancelled: false })
  console.log('EJECUTAR COMANDO')
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Process Update all Crops...')}`)
    await addNewMembersInCrops()
    console.log(`${chalk.green('Finished Update all Crops...')}`)
  }
  process.exit()
})()
