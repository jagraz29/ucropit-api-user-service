import { getSupplies, getTotalTypeSupplies } from '../'

/**
 * Get Supplies.
 *
 * @param Array achievements
 * @param Array crop
 *
 * @returns Number
 */
export const getSuppliesAndTotalTypes = (suppliesParams): Object => {
  const supplies = getSupplies(suppliesParams)
  const totalTypeSupplies = getTotalTypeSupplies(supplies)
  return {
    supplies,
    totalTypeSupplies
  }
}
