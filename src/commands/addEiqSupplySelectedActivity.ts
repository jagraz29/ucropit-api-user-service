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
  let eiqSurfacesSupply = []
  const activities = await ActivityRepository.getActivitiesFilterByName(
    NameActivity.Application
  )

  const achievements = flatten(
    activities.map((activity) => {
      return activity.achievements
    })
  )

  for (const achievement of achievements) {
    const { _id, supplies, surface } = achievement
    for (const supplyApplied of supplies) {
      if (supplyApplied.supply) {
        const eiqSurface = calculateEIQSurfaceAchievement(
          supplyApplied,
          surface
        )
        eiqSurfacesSupply.push(eiqSurface)
      }
    }
    const eiqSurfaceTotal = eiqSurfacesSupply.reduce(
      (prev, next) => prev + (next || 0),
      0
    )
    await AchievementRepository.updateAchievement(
      { eiqSurface: eiqSurfaceTotal },
      _id
    )
    eiqSurfacesSupply = []
    console.log(`${chalk.green(`UPDATE ACHIEVEMENT ID: ${_id}`)}`)
    console.log(`${chalk.green(`EIQ SURFACE: ${eiqSurfaceTotal}`)}`)
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
