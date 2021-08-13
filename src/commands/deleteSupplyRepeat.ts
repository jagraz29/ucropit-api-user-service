require('dotenv').config()
import { Command, OptionValues } from 'commander'
import models, { AchievementModel, connectDb } from '../models'

const program = new Command()
const Supply = models.Supply
const Activity = models.Activity

program
  .description('Use command for clean all supplies repeat')
  .option('-c, --clean', 'Clean all supply repeat')

program.parse(process.argv)

const cleanAllSupplyRepeat = async (): Promise<void> => {
  const suppliesBls: any = await Supply.find({ unit: 'Bls' })

  const otherSupplies: any = await Supply.find({ unit: { $ne: 'Bls' } })

  const temp = {}
  otherSupplies.forEach((elem) => {
    temp[elem.typeId] = { ...elem }
  })

  const duplicates = []
  suppliesBls.forEach((elem) => {
    if (!!temp[elem.typeId]) {
      duplicates.push(elem._id)
    }
  })

  duplicates.forEach((item) => {
    console.log('=======================')
    console.log(`Duplicate: ${item}`)
    console.log('=======================')
  })

  const activities = await Activity.find({
    supplies: { $elemMatch: { supply: { $in: duplicates } } }
  })

  const achievement = await AchievementModel.find({
    supplies: { $elemMatch: { supply: { $in: duplicates } } }
  })

  if (activities.length == 0 && achievement.length == 0)
    await Supply.deleteMany({ _id: { $in: duplicates } })
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.clean) {
        await cleanAllSupplyRepeat()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
