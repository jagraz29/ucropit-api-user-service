require('dotenv').config()

import models, { connectDb } from '../models'
import chalk from 'chalk'
import { TypeActivities } from '../interfaces'
import {
  ActivityRepository,
  TypeAgreementRepository,
  BadgeRepository,
  CropRepository,
} from '../repositories'
import {
  sumActivitiesSurfacesByTypeAgreement,
  getCropBadgesReached,
  calculateCropEiq,
} from '../utils'

const Crop = models.Crop

const start = async () => {
  let crops = await Crop.find()

  for (const crop of crops) {
    try {
      console.log('=== CROP ===')
      console.log(crop._id)

      /**********************************/
      /*       ADD BADGES TO CROP       */
      /**********************************/

      /*
      FIND ACTIVITIES BY SIGNED TRUE AND BE TYPE AGREEMENT
      */
      const dataToFindActivities: any = {
        query: {
          _id: {
            $in: [
              ...crop.toMake,
              ...crop.done,
              ...crop.finished
            ],
          },
          'signers.signed': {
            $nin: [false],
          },
        },
        populate: [{
          path: 'type',
          match: {
            tag: TypeActivities.ACT_AGREEMENTS,
          },
        },{
          path: 'typeAgreement',
        }],
      }

      let activities: Array<any> = await ActivityRepository.getActivities(dataToFindActivities)

      activities = activities.filter((activity) => activity.type && activity.typeAgreement)

      /*
      SUM ALL SURFACES OF ACTIVITIES BY TYPE AGREEMENT AND CROP TYPE IN SOME CASE
      */
      const activitiesSurfaces: any = await sumActivitiesSurfacesByTypeAgreement(activities, crop)

      /*
      FIND ALL TYPE AGREEMENTS
      */
      const typeAgreements: Array<any> = await TypeAgreementRepository.getTypeAgreements({})

      /*
      FIND ALL BADGES
      */
      const badges: Array<any> = await BadgeRepository.getBadges({})

      /*
      FIND ACTIVITIES BY SIGNED TRUE AND TYPE BE APPLICATION FOR AFTER GET THE CROP EIQ
      */
      const dataToFindApplicationActivities: any = {
        query: {
          _id: {
            $in: [
              ...crop.toMake,
              ...crop.done,
              ...crop.finished
            ],
          },
        },
        populate: [{
          path: 'type',
          match: {
            tag: TypeActivities.ACT_APPLICATION,
          },
        },{
          path: 'achievements',
          match: {
            'signers.signed': {
              $nin: [false],
            },
          },
          populate: [
            {
              path: 'supplies.supply'
            },
          ]
        }],
      }

      let applicationActivities: Array<any> = await ActivityRepository.getActivities(dataToFindApplicationActivities)

      applicationActivities = applicationActivities.filter((activity) => activity.type && activity.achievements)

      /*
      GET CROP EIQ
      */
      const cropEiq: number = await calculateCropEiq(applicationActivities)

      /*
      GET BADGES TO ADD TO CROP
      */
      const badgesToAdd: Array<any> = getCropBadgesReached(typeAgreements, badges, activitiesSurfaces, crop, cropEiq)

      /*
      ADD BADGES TO CROP
      */
      const query: any = {
        _id: crop._id
      }

      const dataToUpdate: any = {
        badges: badgesToAdd
      }

      await CropRepository.updateOneCrop(query, dataToUpdate)

      console.log(`${chalk.green(`Successfully: CROP: ${crop.id}`)}`)
    } catch (error) {
      console.log(`${chalk.red(`Error adding badges to crop id: ${crop.id}`)}`)
    }
  }
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    console.log(`${chalk.green('Process Add Badges to all Crops...')}`)

    await start()

    console.log(`${chalk.green('Finished Add Badges to all Crops...')}`)
  }

  process.exit()
})()
