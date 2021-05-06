import {
  Supply,
  ActivePrinciples,
  ActivePrinciplesSupply
} from '../../interfaces/supplies'
import SupplyRepository from '../../repository/supplyRepository'
export function createListSimpleActivePrinciples(
  supply: Supply,
  activePrinciple: ActivePrinciples
): ActivePrinciplesSupply[] {
  let list = []
  const composition: string = supply.compositon.replace(/,/g, '.')

  if (!isCompositionNotNumber(composition)) {
    list.push({
      activePrinciple: activePrinciple._id,
      eiqActivePrinciple: activePrinciple.eiq,
      composition: Number(supply.compositon.replace(/,/g, '.')),
      eiq:
        (activePrinciple.eiq * Number(supply.compositon.replace(/,/g, '.'))) /
        100
    })
  }

  return list
}

export async function createCompoundActivePrinciples(
  supply: Supply
): Promise<ActivePrinciplesSupply[]> {
  let list: Array<ActivePrinciplesSupply> = []
  const compoundName = supply.name.split('+').map((name) => name.trim())
  const compoundComposition = supply.compositon
    .split('+')
    .map((composition) => composition.trim().replace(/,/g, '.'))
    .filter((item) => item !== '')

  if (compoundName.length === compoundComposition.length) {
    const listActivePrinciples = compoundName.map(async (name, index) => {
      const activePrinciple = await SupplyRepository.getOneActivePrinciple({
        'name.es': name
      })
      const composition = compoundComposition[index].replace(/,/g, '.')

      if (activePrinciple && !isCompositionNotNumber(composition)) {
        return {
          activePrinciple: activePrinciple._id,
          eiqActivePrinciple: activePrinciple.eiq,
          composition: Number(composition),
          eiq: (activePrinciple.eiq * Number(composition)) / 100
        }
      }
    })

    list = (await Promise.all(listActivePrinciples)).filter((item) => item)
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
