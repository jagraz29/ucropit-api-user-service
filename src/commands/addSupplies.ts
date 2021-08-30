require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { suppliesSeeds } from './supplies/suppliesSeeds'
import { suppliesPhytosanitary } from './supplies/suppliesPhytosanitary'

import { SupplyRepository } from '../repositories'

const program = new Command()

program
  .description('Use command for add suplies (Seeds, agrochemicals, others)')
  .option('-u, --addSeed', 'Add Seed Type Supply Units')
  .option(
    '-u, --addPhytosanitary',
    'Add supply units of type of addPhytosanitary and others'
  )

program.parse(process.argv)

async function execAddSuppliesSeed() {
  for (const item of suppliesPhytosanitary) {
    try {
      await SupplyRepository.addSuppliesSeed(item)
    } catch (error) {
      console.log(
        `${chalk.green(`Error updating supplies for unit: ${item}`, error)}`
      )
    }
  }
  console.log(`${chalk.green(`SUPPLIES ADD SUCCESSFULLY`)}`)
}

async function execAddSuppliesPhytosanitary() {
  for (const item of suppliesSeeds) {
    try {
      await SupplyRepository.addddSuppliesPhytosanitary(item)
    } catch (error) {
      console.log(
        `${chalk.green(`Error updating supplies for unit: ${item}`, error)}`
      )
    }
  }
  console.log(`${chalk.green(`SUPPLIES ADD SUCCESSFULLY`)}`)
}

;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.addSeed) {
        await execAddSuppliesSeed()
      }

      if (options.addPhytosanitary) {
        await execAddSuppliesPhytosanitary()
      }
    }
  } catch (error) {
    console.log(error)
  }
  process.exit()
})()
