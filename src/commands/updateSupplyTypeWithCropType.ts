require('dotenv').config()
import { connectDb } from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { SupplyTypeByCropType } from '../utils/Constants'

import SupplyTypeRepository from '../repositories/supplyTypeRepository'

const program = new Command()

program
  .description('Use command for update supplies types with crop types')
  .option('-u, --updated', 'Update all supply type with list crop types')
  .option('-c, --cleaned', 'Clean list crop types')

program.parse(process.argv)

const cleanCropTypes = async (): Promise<void> => {
  const supplyTypes = await SupplyTypeRepository.getAll()
  for (const supplyType of supplyTypes) {
    await SupplyTypeRepository.updateOne(supplyType._id, { cropTypes: [] })
    console.log(
      `${chalk.green(`SupplyType ID: ${supplyType._id} cropTypes cleaned`)}`
    )
  }
}

const updateSupplyTypeWithCropType = async (): Promise<void> => {
  for (const item of SupplyTypeByCropType) {
    const supplyTypes: SupplyTypeDocument[] =
      await SupplyTypeRepository.getByIds(item.types)

    if (supplyTypes.length) {
      for (const supplyType of supplyTypes) {
        const cropTypes = supplyType.cropTypes
        cropTypes.push(item.key)
        await SupplyTypeRepository.updateOne(supplyType._id, { cropTypes })
        console.log(
          `${chalk.green(
            `SupplyType ID: ${supplyType._id} is already has updated with CropTypeList`
          )}`
        )
      }
    }
  }
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.updated) {
        await updateSupplyTypeWithCropType()
      }

      if (options.cleaned) {
        await cleanCropTypes()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
