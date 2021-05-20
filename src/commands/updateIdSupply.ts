require('dotenv').config()
import models, { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { data } from './supplies/data'

const { Supply, Achievement } = models

const program = new Command()

program
  .description('Use command for update suplies achievements')
  .option('-u, --updated', 'Update all supplies id in achievements')

program.parse(process.argv)

async function execUpdateSupply() {
  for (const item of data) {
    const achievement = await Achievement.findById(item.achievementId)
    const supply = await Supply.findOne({ code: item.code })

    let supplyApplied = achievement.supplies.id(item.supplyIdApplied)

    if (supply && supplyApplied && Object.keys(supplyApplied).length >= 1) {
      await Achievement.findOneAndUpdate(
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
