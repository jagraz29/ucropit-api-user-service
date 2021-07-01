import { IAchievement } from '../../interfaces'

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
}: IAchievement) {
  const eiqTotalSupplies = supplies.reduce((a, { supply, total }) => {
    if (supply) return a + (supply.eiqTotal || 0) * Number(total)
    return 0
  }, 0)
  const eiqTotal = eiqTotalSupplies / Number(surface)
  return !Number.isNaN(eiqTotal) ? eiqTotal : 0
}

export const calculateEIQSurfaceInAchievements = (surface, achievements) => {
  let eiqTotal = 0
  achievements.forEach((achievement) => {
    const achievementDTO = {
      supplies: achievement.supplies,
      surface
    } as IAchievement
    eiqTotal += calculateEIQSurfaceAchievement(achievementDTO)
  })
  return eiqTotal
}
