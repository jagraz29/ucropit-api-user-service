require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { flatten } from 'lodash'
import CropService from '../services/CropService'

const Crop = models.Crop

const addHarvestDateMonitoring = async () => {
  try {
    let crops: any = await Crop.find({ cancelled: false })
      .populate('cropType')
      .populate({
        path: 'pending',
        populate: [{ path: 'type' }]
      })
      .populate({
        path: 'done',
        populate: [{ path: 'type' }]
      })
      .populate({
        path: 'finished',
        populate: [{ path: 'type' }]
      })

    crops = crops.filter(
      (crop) => crop.finished.length > 0 || crop.done.length > 0
    )

    const activities = crops
      .map((crop) => {
        const activitiesPending = crop.pending.filter(
          (activity) => activity.type.tag === 'ACT_MONITORING'
        )
        const activitiesDone = crop.done.filter(
          (activity) => activity.type.tag === 'ACT_MONITORING'
        )
        const activitiesFinished = crop.finished.filter(
          (activity) => activity.type.tag === 'ACT_MONITORING'
        )

        return {
          activities: [
            ...activitiesPending,
            ...activitiesDone,
            ...activitiesFinished
          ],
          crop: crop
        }
      })
      .filter((activity) => activity.activities.length > 0)

    const flatActivities = flatten(activities)

    for (const item of flatActivities) {
      for (const activity of item.activities) {
        if (!activity.dateEstimatedHarvest) {
          const monitoring = await CropService.getLastMonitoring(item.crop._id)
          activity.dateEstimatedHarvest =
            monitoring.dateEstimatedHarvest || item.crop.dateHarvest

          await activity.save()

          console.log(
            `${chalk.green(
              `Activity ID: ${activity._id} is updated with dateEstimatedHarvest`
            )}`
          )
        } else {
          console.log(
            `${chalk.green(
              `Activity ID: ${activity._id} is already has dateEstimatedHarvest`
            )}`
          )
        }
      }
    }
  } catch (error) {
    console.log(`${chalk.red(`Error: ${error}`)}`)
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Activity add harvest date')}`)
    await addHarvestDateMonitoring()
    console.log(`${chalk.green('Activity add harvest date finished')}`)
  }
  process.exit()
})()
