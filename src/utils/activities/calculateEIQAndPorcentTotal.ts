import {
  parseSuppliesWithEiqTotalInAchievements,
  sumEIQInAchievements,
  sumPercentInAchievements
} from './../achievements/'
import { parseSuppliesWithEiqTotal } from '../supplies'
import { Numbers } from '../Numbers'

export const calculateEIQAndPorcentTotal = (activities) =>
  activities.map(calculateEiqOfActivity)

export const calculateEiqOfActivity = (activity) => {
  const { achievements, supplies } = activity
  const suppliesWithEiqTotal = parseSuppliesWithEiqTotal(supplies, true)
  const achievementsWithEiq =
    parseSuppliesWithEiqTotalInAchievements(achievements)
  const percentTotal = sumPercentInAchievements(achievementsWithEiq)
  const eiqPlanned = Numbers.roundToTwo(sumEIQInSupplies(suppliesWithEiqTotal))
  const eiqApplied = Numbers.roundToTwo(
    sumEIQInAchievements(achievementsWithEiq)
  )
  return {
    ...activity,
    achievements: achievementsWithEiq,
    supplies: suppliesWithEiqTotal,
    percentTotal,
    eiqApplied,
    eiqPlanned,
    eiq: eiqApplied || eiqPlanned
  }
}

const reduceSumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
