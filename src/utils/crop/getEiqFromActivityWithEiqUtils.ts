import { Numbers } from '../Numbers'

export const getEiqFromActivityWithEiq = (activitiesWithEiq): number => {
  return Numbers.roundToTwo(activitiesWithEiq.reduce((a, b) => a + b.eiq, 0))
}
