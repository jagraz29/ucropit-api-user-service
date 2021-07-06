import { Numbers } from '../Numbers'

export const getEiqFromActivityWithEiq = (activitiesWithEiq): number => {
  return Numbers.roundToTwo(
    activitiesWithEiq.reduce((acum, { eiq }) => acum + eiq, 0)
  )
}
