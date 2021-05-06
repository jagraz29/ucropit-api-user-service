require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { Supply, ActivePrinciples } from '../interfaces/supplies'
import { supplyTypesEIQ } from '../utils/Constants'
import SupplyRepository from '../repository/supplyRepository'
import {
  isSupplyCompoundIngredient,
  createListSimpleActivePrinciples,
  createCompoundActivePrinciples
} from '../utils'

const program = new Command()

program
  .description('Use this command to add the active ingredients of an input')
  .option('-a, --add', 'Add active ingredients into supplies')
  .option('-l, --list', 'List all supplies with active ingredients')

program.parse(process.argv)

/**
 * Update list active principles simple in Supply.
 *
 * @param Supply supply
 */
async function updateActivePrincipleSimpleSupply(
  supply: Supply
): Promise<void> {
  const activePrinciple = await SupplyRepository.getOneActivePrinciple({
    'name.es': supply.name
  })
  if (activePrinciple) {
    const activesPrinciples = createListSimpleActivePrinciples(
      supply,
      activePrinciple
    )
    console.log(`${chalk.green(`NAME: ${supply.name}`)}`)
    console.log(`${chalk.green(`CODE: ${supply.code}`)}`)
    await SupplyRepository.updateOne(supply._id, {
      $set: { activesPrinciples: activesPrinciples }
    })
  }
}

/**
 * Update list active principles compound in Supply.
 *
 * @param Supply supply
 */
async function updateActivePrincipleCompoundSupply(
  supply: Supply
): Promise<void> {
  const listAsync = createCompoundActivePrinciples(supply)

  console.log(`${chalk.green(`NAME: ${supply.name}`)}`)
  console.log(`${chalk.green(`CODE: ${supply.code}`)}`)
  await SupplyRepository.updateOne(supply._id, {
    $set: { activesPrinciples: listAsync }
  })
}

/**
 *
 */
async function updateActivePrinciples() {
  console.log(`${chalk.yellow('ADD ACTIVE INGREDIENTS')}`)
  const supplies = await SupplyRepository.getSuppliesBySupplyTypes(
    supplyTypesEIQ
  )

  for (const supply of supplies) {
    if (!isSupplyCompoundIngredient(supply)) {
      await updateActivePrincipleSimpleSupply(supply)
    } else {
      await updateActivePrincipleCompoundSupply(supply)
    }
  }

  console.log(`${chalk.yellow('FINISH ACTIVE INGREDIENTS')}`)
}
;(async () => {
  try {
    const connected = await connectDb()

    if (connected) {
      const options: OptionValues = program.opts()

      if (options.add) {
        await updateActivePrinciples()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
