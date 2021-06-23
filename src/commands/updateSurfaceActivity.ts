require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { ActivityRepository } from '../repositories'
import { StatusActivities } from '../interfaces'
import { Numbers } from '../utils'

const program = new Command()

program
  .description('Use this command to updated surfaces activities')
  .option('-l, --list', 'List all harvest activities with surface in 0')
  .option(
    '-u, --update',
    'Update Surface activities harvest when surface is equal 0'
  )

program.parse(process.argv)

async function getActivitiesHarvestDoneOrFinished() {
  return ActivityRepository.findAll(
    {
      name: 'Cosecha',
      surface: 0,
      $or: [
        { 'status.name.en': StatusActivities.DONE },
        { 'status.name.en': StatusActivities.FINISHED }
      ]
    },
    {
      path: 'lots'
    }
  )
}

/**
 * Update Activities Harvest surface
 */
async function updateActivitiesSurface() {
  const activities: any = await getActivitiesHarvestDoneOrFinished()

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

/**
 * List Activities Harvest with surface 0
 */
async function listActivitiesWithSurfaceZero(): Promise<void> {
  const activities = await getActivitiesHarvestDoneOrFinished()

  activities.map(({ _id, surface }: any) =>
    console.log(
      `${chalk.green(`Activity ID: ${_id}`)} - ${chalk.green(
        `Surface: ${surface}`
      )}`
    )
  )
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.list) {
        await listActivitiesWithSurfaceZero()
      }

      if (options.update) {
        await updateActivitiesSurface()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
