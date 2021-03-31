require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { flatten } from 'lodash'
import BlockChainServices from '../services/BlockChainService'
import ApprovalRegisterSingService from '../services/ApprovalRegisterSignService'

const Crop = models.Crop

const addHarvestDateMonitoring = async () => {
  let crops = await Crop.find({ cancelled: false })
    .populate('cropType')
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
      const activitiesDone = crop.done.filter(
        (activity) => activity.type.tag === 'ACT_MONITORING'
      )
      const activitiesFinished = crop.finished.filter(
        (activity) => activity.type.tag === 'ACT_MONITORING'
      )

      return {
        activities: [...activitiesDone, ...activitiesFinished],
        cropId: crop._id
      }
    })
    .filter((activity) => activity.activities.length > 0)

  console.log('ACTIVIDADES')
  const flatActivities = flatten(activities)
  console.log(flatActivities)
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
