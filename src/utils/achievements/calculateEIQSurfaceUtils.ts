import { Achievement } from '../../interfaces'

/**
 * Calculate Achievement's EIQ Surface.
 *
 * @param Supply supply
 * @param number surfaceAchievement
 *
 * @returns Number
 */
export function calculateEIQSurfaceAchievement({
  supplies,
  surface
}: Achievement) {
  let eiqTotalSupplies = []
  for (const supplyApplied of supplies) {
    if (supplyApplied.supply) {
      eiqTotalSupplies.push(supplyApplied.supply.eiqTotal || 0)
    }
  }
  const eiqTotal = eiqTotalSupplies.reduce(
    (prev, next) => prev + (next || 0),
    0
  )
  const result = eiqTotal / Number(surface)
  return !Number.isNaN(result) ? result : 0
}
