require('dotenv').config()
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { connectDb } from '../models'
import {
  ActivityRepository,
  CropRepository,
  UserRepository
} from '../repositories'
import { StatusActivities } from '../interfaces'
import { Numbers } from '../utils'

const program = new Command()

program
  .description('Use this command to updated surfaces activities')
  .option('-u, --user <user>', 'User email')
  .option('-i, --identifier <identifier>', 'Company identifier')
  .option('-t, --activity-type <type>', 'Activity type id')
  .option('-u, --update', 'Update Surface activities when surface is equal 0')
  .option(
    '-l, --list',
    'List activities with surface 0 by user activity id and crop'
  )

program.parse(process.argv)

async function hasActivitiesWithSurfaceZero(
  userEmail: string,
  activityType: string
) {
  const user = await UserRepository.getByEmail(userEmail)

  if (!user) {
    console.log(`${chalk.green(`User not found`)}`)
  } else {
    return ActivityRepository.findAll(
      {
        name: activityType,
        surface: 0,
        user: user._id,
        $or: [
          { 'status.name.en': StatusActivities.DONE },
          { 'status.name.en': StatusActivities.FINISHED },
          { 'status.name.en': StatusActivities.TOMAKE }
        ]
      },
      {
        path: 'lots'
      }
    )
  }
}

async function updateActivitiesWithSurfaceZeroByUser(
  user: string,
  activityType: string
) {
  const activities: any[] = await hasActivitiesWithSurfaceZero(
    user,
    activityType
  )

  if (!activities.length) {
    console.log(`${chalk.green(`No activities to update`)}`)
  } else {
    console.log(`${chalk.green(`${activities.length} to update`)}`)
    for (const activity of activities) {
      const surface = activity.lots.reduce(
        (prev, { surface }) => prev + (surface || 0),
        0
      )

      await ActivityRepository.updateActivity(
        { surface: Numbers.roundToTwo(surface) },
        activity._id
      )
      console.log(`${chalk.green(`Update Activity ID: ${activity._id}`)}`)
    }
  }
}

async function updatesActivitiesWithSurfaceZeroByIdentifier(
  identifier: string
) {
  const crops: any[] = await CropRepository.findAllCropsByCompanies(identifier)
  if (crops.length === 0) {
    console.log(`${chalk.green(`Crops not found`)}`)
  } else {
    let activitiesUpdated = 0
    crops.forEach((crop: any) => {
      crop.activities.forEach(async (activity: any) => {
        if (activity.surface === 0) {
          const surface = activity.lots.reduce(
            (prev, { surface }) => prev + (surface || 0),
            0
          )

          await ActivityRepository.updateActivity(
            { surface: Numbers.roundToTwo(surface) },
            activity._id
          )
          activitiesUpdated++
          console.log(`${chalk.green(`Update Activity ID: ${activity._id}`)}`)
        }
      })
    })
    console.log(
      `${chalk.green(`Activities updated by identifier: ${activitiesUpdated}`)}`
    )
  }
}

async function updateActivities() {
  const options: OptionValues = program.opts()
  const { user, activityType, identifier } = options

  if (user && activityType) {
    await updateActivitiesWithSurfaceZeroByUser(user, activityType)
  }

  if (identifier) {
    await updatesActivitiesWithSurfaceZeroByIdentifier(identifier)
  }
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.update) {
        await updateActivities()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
