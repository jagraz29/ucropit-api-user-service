require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command } from 'commander'
import { unitsByTypeId } from './supplies/unitsByTypeId'

// const { Supply } = models
import SupplyRepository from '../repositories/supplyRepository'

const program = new Command()

program.description('Use command for update suplies units by typeId')

program.parse(process.argv)

async function execUpdateSupplyByTypeId() {
  for (const item of unitsByTypeId) {
    try {
      await SupplyRepository.updateManyByTypeId(item.ids, { unit: item.unit })
    } catch (error) {
      console.log(
        `${chalk.green(
          `Error updating supplies for unit: ${item.unit}`,
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
      await execUpdateSupplyByTypeId()
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
