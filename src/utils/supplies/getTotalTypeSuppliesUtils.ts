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
    if (supplies.length) {
      supplies.map(({ type: { code, name } }) => {
        if (code === key) {
          totalTypeSupplies.push({ quantity: count + 1, name })
        }
      })
    }

  }
  return totalTypeSupplies
}
