require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { supplyUnit } from './supplies/supplyUnit'

import { SupplyRepository } from '../repositories'

const program = new Command()

program
  .description('Use command for update supplies units by code number')
  .option('-u, --update', 'Update all supplies unit by code number')

program.parse(process.argv)

async function execUpdateSupplyByCodeNum() {
  for (const item of supplyUnit) {
    const { code, unit } = item
    try {
      await SupplyRepository.updateOneByCodes(code, { unit: unit })
    } catch (error) {
      console.log(
        `${chalk.green(
          `Error updating supplies for code number: ${code}`,
          error
        )}`
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

      if (options.update) {
        await execUpdateSupplyByCodeNum()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
