require('dotenv').config()

import models, { connectDb } from '../models'
import chalk from 'chalk'
import { CropRepository } from '../repositories'
import { calculateCropVolumeUtils } from '../utils'

const Crop = models.Crop

const start = async () => {
  let crops = await Crop.find().populate('unitType')

  for (const crop of crops) {
    try {
      console.log('=== CROP ===')
      console.log(crop._id)

      /**********************************/
      /*       ADD VOLUME TO CROP       */
      /**********************************/

      let volume = 0

      try {
        volume = calculateCropVolumeUtils(
          crop.unitType.key,
          crop.pay,
          crop.surface
        )
      } catch (error) {
        console.log(error)
        console.log(
          `${chalk.red(`Error calculating volume to crop id: ${crop.id}`)}`
        )
      }

      /*
      ADD VOLUME TO CROP
      */
      const query: any = {
        _id: crop._id,
      }

      const dataToUpdate: any = {
        volume,
      }

      await CropRepository.updateOneCrop(query, dataToUpdate)

      console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
    } catch (error) {
      console.log(error)
      console.log(`${chalk.red(`Error adding volume to crop id: ${crop.id}`)}`)
    }
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Process Add Volume to all Crops...')}`)

    await start()

    console.log(`${chalk.green('Finished Add Volume to all Crops...')}`)
  }

  process.exit()
})()
