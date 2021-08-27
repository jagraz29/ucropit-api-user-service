require('dotenv').config()
import { connectDb } from '../models'
import { SupplyTypeDocument } from '../models/supplyType'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { typesSupplies } from '../utils/Constants'
import { uniq } from 'lodash'

import { SupplyTypeRepository } from '../repositories'

const program = new Command()

program
  .description('Use command for update supplies types with activities')
  .option('-u, --updated', 'Update all supply type with list activity type')

program.parse(process.argv)

const updateSupplyTypeWithActivityType = async (): Promise<void> => {
  //Fix Code SeSo en Semilla Sorgo por SeSor
  const query = { name: 'Semilla de Sorgo' }
  const supplyType = await SupplyTypeRepository.findOneByQuery(query)
  if (supplyType) {
    await SupplyTypeRepository.updateOne(supplyType._id, { code: 'SeSor' })
  }

  for (const item of typesSupplies) {
    const supplyTypes: SupplyTypeDocument[] =
      await SupplyTypeRepository.getByCodes(item.codes)

    if (supplyTypes.length) {
      for (const supplyType of supplyTypes) {
        const activities = supplyType.activities ?? []
        if (item.tag) activities.push(item.tag)
        await SupplyTypeRepository.updateOne(supplyType._id, {
          activities: uniq(activities)
        })
        console.log(
          `${chalk.green(
            `SupplyType ID: ${supplyType._id} | code: ${supplyType.code} is already has updated`
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
