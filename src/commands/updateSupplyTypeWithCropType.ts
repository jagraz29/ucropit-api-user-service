require('dotenv').config()
import { connectDb } from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
import chalk from 'chalk'
import { uniq } from 'lodash'
import { Command, OptionValues } from 'commander'
import { SupplyTypeByCropType } from '../utils/Constants'

import { SupplyTypeRepository } from '../repositories'

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
  //Fix Code SeSo en Semilla Sorgo por SeSor
  const query = { name: 'Semilla de Sorgo' }
  const supplyType = await SupplyTypeRepository.findOneByQuery(query)
  if (supplyType) {
    await SupplyTypeRepository.updateOne(supplyType._id, { code: 'SeSor' })
  }

  for (const item of SupplyTypeByCropType) {
    const supplyTypes: SupplyTypeDocument[] =
      await SupplyTypeRepository.getByCodes(item.codes)

    if (supplyTypes.length) {
      for (const supplyType of supplyTypes) {
        const cropTypes = supplyType.cropTypes ?? []
        if (item.key) cropTypes.push(item.key)
        await SupplyTypeRepository.updateOne(supplyType._id, {
          cropTypes: uniq(cropTypes)
        })
        console.log(
          `${chalk.green(
            `SupplyType ID: ${supplyType._id} | code: ${supplyType.code}  is already has updated with CropTypeList`
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
