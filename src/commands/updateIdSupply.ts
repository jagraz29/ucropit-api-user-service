require('dotenv').config()
import models, { connectDb, AchievementModel } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { data } from './supplies/data'

const { Supply } = models

const program = new Command()

program
  .description('Use command for update suplies achievements')
  .option('-u, --updated', 'Update all supplies id in achievements')

program.parse(process.argv)

async function execUpdateSupply() {
  for (const item of data) {
    const achievement: any = await AchievementModel.findById(item.achievementId)
    const supply = await Supply.findOne({ code: item.code })

    const supplyApplied = achievement.supplies.id(item.supplyIdApplied)

    if (supply && supplyApplied && Object.keys(supplyApplied).length >= 1) {
      await AchievementModel.findOneAndUpdate(
        { _id: item.achievementId, 'supplies._id': supplyApplied._id },
        { $set: { 'supplies.$.supply': supply._id } }
      )

      console.log(`${chalk.green(`ACHIEVEMENT ID: ${achievement._id}`)}`)
      console.log(`${chalk.green(`SUPPLY APPLIED ID: ${supplyApplied._id}`)}`)
    }
  }
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.updated) {
        await execUpdateSupply()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
