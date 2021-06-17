import { generateArrayPercentage } from '../utils/GenerateArrayPercentage'

require('dotenv').config()

import models, { connectDb } from '../models'
import chalk from 'chalk'
import LotService from '../services/LotService'

const Lots = models.Lot

const start = async () => {
  let lot, cursor, count = 0, countLots = 0, maxLen = 50
  let porcentages = generateArrayPercentage('.', maxLen)
  try {
    countLots = await LotService.count({})
    cursor = await Lots.aggregate([])
    .cursor()
    .exec()
    console.log(countLots)

    while (lot = await cursor.next()) {
      const { countryName, provinceName, cityName, image, area } = lot
      let dataToUpdate = {
        provinceName,
        countryName,
        cityName,
        image,
        errorInStaticImage: false
      }
      if (area.length) {
        const centroid = await LotService.getCentroid(area)
        if (centroid) {

          if (!countryName) {
            const locationData: any = await LotService.getLocationData(
              centroid.latitude,
              centroid.longitude
            )
            const { country, province, city } = locationData
            dataToUpdate.countryName = country
            dataToUpdate.provinceName = province
            dataToUpdate.cityName = city
          }
          if (!image?.normal) {
            const staticImage = await LotService.findImagesGeographics(lot, centroid)
            dataToUpdate.image = staticImage
            dataToUpdate.errorInStaticImage = staticImage ? false : true
          }
        }
      }

      Lots.updateOne({_id: lot._id}, {$set: dataToUpdate},{new: true}).exec()
      count++
      let index = parseInt((count * maxLen) / countLots )
      porcentages = generateArrayPercentage('#', index + 1, porcentages)
      console.log(`[${porcentages.join('')}] ${parseFloat((index / maxLen) * 100).toFixed(0)}% | ${count}/${countLots} Lots`)
    }
    console.log(`Total Lots: ${ count }`)
  } catch (err) {
    console.log('Error:')
    console.log(err)
  }
}

(async () => {
  const connected = await connectDb()
  console.time('update_lots_with_image')

  if (connected) {
    console.log(`${ chalk.green('Process for update images in all Lots...') }`)

    await start()

    console.log(`${ chalk.green('Finished update images in all Lots all Crops...') }`)
  }
  console.timeEnd('update_lots_with_image')
  process.exit()
})()
