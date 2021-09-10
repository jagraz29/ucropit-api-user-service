require('dotenv').config()
import { Command, OptionValues } from 'commander'
import { Crop } from '../interfaces'
import models, { connectDb } from '../models'
import { data } from './companies/dataCompaniesDelete'
const program = new Command()
const Activity = models.Activity
const Company = models.Company
const Crop = models.Crop

program
  .description('Use command for clean companies')
  .option('-c, --clean', 'Clean companies By Ids')

program.parse(process.argv)

const cleanCompaniesByIds = async (): Promise<void> => {
  for (const item of data) {
    await deleteActivitiesByCrop(item.Crop_ID)
    await deleteCropById(item.Crop_ID)
    await deleteCompanyByIdentifier(item.CUIT)
  }
}
const deleteActivitiesByCrop = async (cropId: string) => {
  const crop: any = await Crop.findById(cropId)
    .populate('pending')
    .populate('toMake')
    .populate('done')
    .populate('finished')

  if (crop) {
    await crop.pending.map(async (activity) => {
      console.log('=======================')
      console.log(
        `delete Activity pending: ${activity._id} in crop ID: ${cropId}`
      )
      console.log('=======================')
      await Activity.deleteOne({ _id: activity._id })
    })
    await crop.toMake.map(async (activity) => {
      console.log('=======================')
      console.log(
        `delete Activity toMake: ${activity._id} in crop ID: ${cropId}`
      )
      console.log('=======================')
      await Activity.deleteOne({ _id: activity._id })
    })
    await crop.done.map(async (activity) => {
      console.log('=======================')
      console.log(`delete Activity done: ${activity._id} in crop ID: ${cropId}`)
      console.log('=======================')
      await Activity.deleteOne({ _id: activity._id })
    })
    await crop.finished.map(async (activity) => {
      console.log('=======================')
      console.log(
        `delete Activity finished: ${activity._id} in crop ID: ${cropId}`
      )
      console.log('=======================')
      await Activity.deleteOne({ _id: activity._id })
    })
  }
}
const deleteCropById = async (cropId: string) => {
  console.log('=======================')
  console.log(`delete crop ID: ${cropId}`)
  console.log('=======================')
  await Crop.deleteOne({ _id: cropId })
}
const deleteCompanyByIdentifier = async (identifier: string) => {
  console.log('=======================')
  console.log(`delete Company with identifier: ${identifier}`)
  console.log('=======================')
  await Company.deleteOne({ identifier })
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.clean) {
        await cleanCompaniesByIds()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
