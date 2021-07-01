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
  const totalTypeSupplies = []
  for (const key in SupplyType) {
    const count = 0
    supplies.map((supply) => {
      const { code, name } = supply || {}
      if (code === key) {
        totalTypeSupplies.push({ quantity: count + 1, name })
      }
    })
  }
  return totalTypeSupplies
}
