import {
  Supply,
  ActiveIngredient,
  ActiveIngredientsSupply
} from '../../interfaces/supplies'
import SupplyRepository from '../../repository/supplyRepository'
export function createListSimpleActiveIngredients(
  supply: Supply,
  activeIngredient: ActiveIngredient
): ActiveIngredientsSupply[] {
  let list = []
  const composition: string = supply.compositon.replace(/,/g, '.')

  if (!isCompositionNotNumber(composition)) {
    list.push({
      activeIngredient: activeIngredient._id,
      eiqActiveIngredient: activeIngredient.eiq,
      composition: Number(supply.compositon.replace(/,/g, '.')),
      eiq:
        (activeIngredient.eiq * Number(supply.compositon.replace(/,/g, '.'))) /
        100
    })
  }

  return list
}

export async function createCompoundActiveIngredients(
  supply: Supply
): Promise<ActiveIngredientsSupply[]> {
  let list: Array<ActiveIngredientsSupply> = []
  const compoundName = supply.name.split('+').map((name) => name.trim())
  const compoundComposition = supply.compositon
    .split('+')
    .map((composition) => composition.trim().replace(/,/g, '.'))
    .filter((item) => item !== '')

  if (compoundName.length === compoundComposition.length) {
    const listActiveIngredients = compoundName.map(async (name, index) => {
      const activeIngredient = await SupplyRepository.getOneActiveIngredient({
        'name.es': name
      })
      const composition = compoundComposition[index].replace(/,/g, '.')

      if (activeIngredient && !isCompositionNotNumber(composition)) {
        return {
          activeIngredient: activeIngredient._id,
          eiqActiveIngredient: activeIngredient.eiq,
          composition: Number(composition),
          eiq: (activeIngredient.eiq * Number(composition)) / 100
        }
      }
    })

    list = (await Promise.all(listActiveIngredients)).filter((item) => item)
  }

  return list
}

/**
 * Verify name supply is Compound.
 *
 * @param Supply supply
 *
 * @returns boolean
 */
export function isSupplyCompoundIngredient(supply: Supply): boolean {
  const compoundName = supply.name.split('+')

  return compoundName.length > 1
}

/**
 *
 * @param composition
 * @returns
 */
function isCompositionNotNumber(composition: string): boolean {
  return Number.isNaN(Number(composition))
}
