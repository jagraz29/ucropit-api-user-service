require('dotenv').config()
import { connectDb } from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import {
  Supply,
  ActiveIngredient,
  ActiveIngredientUnified as ActiveIngredientStandard
} from '../interfaces/supplies'
import { supplyTypesEIQ } from '../utils/Constants'
import SupplyRepository from '../repositories/supplyRepository'
import {
  isSupplyCompoundIngredient,
  createListSimpleActiveIngredients,
  createCompoundActiveIngredients
} from '../utils'
import { activeIngredientUnified } from '../types/activeIngredients'

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
async function updateActiveIngredientsSimpleSupply(
  supply: Supply
): Promise<void> {
  const activeIngredientStandard: ActiveIngredientStandard =
    activeIngredientUnified.find(
      (ingredient) => supply.name.trim() === ingredient.active_principle.trim()
    )

  if (activeIngredientStandard) {
    const activePrinciple: ActiveIngredient =
      await SupplyRepository.getOneActiveIngredient({
        'name.es': activeIngredientStandard.active_ingredient_unified
      })

    if (activePrinciple) {
      const activeIngredients = createListSimpleActiveIngredients(
        supply,
        activePrinciple
      )
      console.log(`${chalk.green(`NAME: ${supply.name}`)}`)
      console.log(`${chalk.green(`CODE: ${supply.code}`)}`)
      console.log(activeIngredients)
      await SupplyRepository.updateOne(supply._id, {
        $set: { activeIngredients: activeIngredients }
      })
    }
  }
}

/**
 * Update list active principles compound in Supply.
 *
 * @param Supply supply
 */
async function updateActiveIngredientsCompoundSupply(
  supply: Supply
): Promise<void> {
  const listAsyncActiveIngredients = await createCompoundActiveIngredients(
    supply
  )

  console.log(`${chalk.green(`NAME: ${supply.name}`)}`)
  console.log(`${chalk.green(`CODE: ${supply.code}`)}`)
  console.log(listAsyncActiveIngredients)
  await SupplyRepository.updateOne(supply._id, {
    $set: { activeIngredients: listAsyncActiveIngredients }
  })
}

/**
 * Update Supplies list.
 */
async function updateSupplies() {
  console.log(`${chalk.yellow('ADD ACTIVE INGREDIENTS')}`)
  const supplies: any = await SupplyRepository.getSuppliesBySupplyTypes(
    supplyTypesEIQ
  )

  for (const supply of supplies) {
    if (!isSupplyCompoundIngredient(supply)) {
      await updateActiveIngredientsSimpleSupply(supply)
    } else {
      await updateActiveIngredientsCompoundSupply(supply)
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
        await updateSupplies()
      }
    }
  } catch (error) {
    console.log(error)
  }

  process.exit()
})()
