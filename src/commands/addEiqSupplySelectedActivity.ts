require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { flatten } from 'lodash'
import { Command, OptionValues } from 'commander'
import {
  AchievementRepository,
  ActivityRepository,
  NameActivity
} from '../repositories'
import { calculateEIQSurfaceAchievement } from '../utils'

const program = new Command()

program
  .description(
    'Use this command to add EIQ Surface supply selected in the activities'
  )
  .option('-a, --add', 'Add EIQ index supply selected in activity')

program.parse(process.argv)

/**
 * Add Achievement's EIQ Surface
 */
async function addEIQSupplySelectedInActivity() {
  const activities: any = await ActivityRepository.getActivitiesFilterByName(
    NameActivity.Application
  )

  const achievements = flatten(
    activities.map((activity) => {
      return activity.achievements
    })
  )

  for (const achievement of achievements) {
    const eiqSurface = calculateEIQSurfaceAchievement(achievement)
    await AchievementRepository.updateAchievement(
      { eiqSurface: eiqSurface },
      achievement._id
    )
    if (eiqSurface > 0) {
      console.log(`${chalk.green(`UPDATE ACHIEVEMENT ID: ${achievement._id}`)}`)
      console.log(`${chalk.green(`EIQ SURFACE: ${eiqSurface}`)}`)
    }
  }
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.add) {
        await addEIQSupplySelectedInActivity()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
