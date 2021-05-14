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
    const supply = await Supply.find({ code: item.code })

    let supplies = achievement.supplies.id(item.SupplyIdApplied)

    if (supplies != null && Object.keys(supplies).length >= 1) {
      await Achievement.updateOne(
        { _id: item.achievementId },
        { $set: { 'supplies.$[elem]._id': supply[0]._id } },
        { arrayFilters: [{ 'elem._id': { $gte: item.SupplyIdApplied } }] }
      )
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
