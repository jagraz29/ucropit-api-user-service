require('dotenv').config()
import { connectDb } from '../models'
import models from '../models'
import chalk from 'chalk'
import { Command, OptionValues } from 'commander'
import { suppliesSeeds } from './supplies/suppliesSeeds'
import { suppliesPhytosanitary } from './supplies/suppliesPhytosanitary'
import { activeIngredientUnified } from '../types/activeIngredients'
import {
  Supply as SupplyInterfaces,
  ActiveIngredient as ActiveIngredientInterfaces,
  ActiveIngredientUnified as ActiveIngredientStandard
} from '../interfaces/supplies'
const { Country } = models

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

async function createListActiveIngredients(item) {
  const list = []
  let activeIngredient = null

  for (let index = 0; index < 5; index++) {
    const ingredient = item[`activeIngredients_${index}`].trim()
    const composition = item[`composition_${index}`].trim()

    if (ingredient !== '' && composition !== '') {
      const activeIngredientStandard: ActiveIngredientStandard =
        activeIngredientUnified.find(
          (ingredientUnified) => ingredient === ingredientUnified
        )

      if (activeIngredientStandard) {
        activeIngredient = await SupplyRepository.getOneActiveIngredient({
          'name.es': activeIngredientStandard.active_ingredient_unified
        })
      } else {
        activeIngredient = await SupplyRepository.getOneActiveIngredient({
          'name.es': ingredient
        })
      }

      if (activeIngredient) {
        list.push({
          activeIngredient: activeIngredient._id,
          eiqActiveIngredient: activeIngredient.eiq,
          composition: Number(composition.replace(/,/g, '.')),
          eiq:
            (activeIngredient.eiq * Number(composition.replace(/,/g, '.'))) /
            100
        })
      }
    }
  }

  return list
}

/**
 *
 * @param item
 */
async function addSuppliesPhytosanitary(item) {
  const country: any = await Country.find({
    alpha3Code: item.alphaCode
  }).lean()

  const supplyInterfaces: SupplyInterfaces = {
    name: item.name.trim(),
    company: item.company,
    code: item.code,
    typeId: item.typeId,
    supplyType: item.supplyType
  }

  if (
    item.composition_0.trim() !== '' &&
    item.composition_1.trim() === '' &&
    item.composition_2.trim() === '' &&
    item.composition_3.trim() === '' &&
    item.composition_4.trim() === ''
  ) {
    const supply = {
      ...supplyInterfaces,
      compositon: item.composition_0
    }

    const listIngredientsSimple = await createListActiveIngredients(item)

    const data = {
      ...supply,
      unit: item.unit,
      brand: item.brand,
      alphaCode: country[0].alpha3Code,
      countryId: country[0]._id,
      activeIngredients: listIngredientsSimple
    }

    return SupplyRepository.create(data)
  } else {
    let composition = ''
    if (item.composition_1.trim() !== '') {
      composition = item.composition_0.concat('+', item.composition_1)
    }
    if (item.composition_2.trim() !== '') {
      composition = composition.concat('+', item.composition_2)
    }
    if (item.composition_3.trim() !== '') {
      composition = composition.concat('+', item.composition_3)
    }
    if (item.composition_4.trim() !== '') {
      composition = composition.concat('+', item.composition_4)
    }

    const supply = {
      ...supplyInterfaces,
      compositon: composition
    }

    const listActiveIngredients = await createListActiveIngredients(item)

    const data = {
      ...supply,
      unit: item.unit,
      brand: item.brand,
      alphaCode: country[0].alpha3Code,
      countryId: country[0]._id,
      activeIngredients: listActiveIngredients
    }
    return SupplyRepository.create(data)
  }
}

async function execAddSuppliesSeed() {
  for (const item of suppliesSeeds) {
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
  for (const item of suppliesPhytosanitary) {
    try {
      const result = await addSuppliesPhytosanitary(item)
      console.log(result)
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
