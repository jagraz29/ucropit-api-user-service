require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { unitsByTypeId } from './supplies/unitsByTypeId'

import { SupplyRepository } from '../repositories'

const program = new Command()

program
  .description('Use command for update suplies units by typeId')
  .option('-u, --updated', 'Update all supplies unit by typeId')

program.parse(process.argv)

async function execUpdateSupplyByTypeId() {
  for (const item of unitsByTypeId) {
    const { ids, unit } = item
    try {
      await SupplyRepository.updateManyByTypeId(ids, { unit: unit })
    } catch (error) {
      console.log(
        `${chalk.green(`Error updating supplies for unit: ${unit}`, error)}`
      )
    }
  }
  console.log(`${chalk.green(`SUPPLIES UPDATED SUCCESSFULLY`)}`)
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.updated) {
        await execUpdateSupplyByTypeId()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
