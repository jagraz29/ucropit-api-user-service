require('dotenv').config()
import { connectDb } from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { typesSupplies } from '../utils/Constants'

import { SupplyTypeRepository } from '../repositories'

const program = new Command()

program
  .description('Use command for update supplies types with activities')
  .option('-u, --updated', 'Update all supply type with list activity type')

program.parse(process.argv)

const updateSupplyTypeWithActivityType = async (): Promise<void> => {
  for (const item of typesSupplies) {
    const supplyTypes: SupplyTypeDocument[] =
      await SupplyTypeRepository.getByIds(item.types)

    if (supplyTypes.length) {
      for (const supplyType of supplyTypes) {
        const activities = supplyType.activities
        activities.push(item.tag)
        await SupplyTypeRepository.updateOne(supplyType._id, { activities })
        console.log(
          `${chalk.green(
            `SupplyType ID: ${supplyType._id} is already has updated`
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
        await updateSupplyTypeWithActivityType()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
