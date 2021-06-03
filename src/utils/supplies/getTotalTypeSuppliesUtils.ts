import { SupplyType } from '../../interfaces'

/**
 * Get Achievement's.
 *
 * @param Array achievements
 * @param Array crop
 *
 * @returns Number
 */
export const getTotalTypeSupplies = (supplies): Object => {
  let totalTypeSupplies = []
  for (const key in SupplyType) {
    let count = 0
    supplies.map((supply) => {
      if (supply.type) {
        const { code, name } = supply.type
        if (code === key) {
          totalTypeSupplies.push({ quantity: count + 1, name })
        }
      }

    })
  }
  return totalTypeSupplies
}
