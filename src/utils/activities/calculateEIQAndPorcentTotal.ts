import {
  parseSuppliesWithEiqTotalInAchievements,
  sumEIQInAchievements,
  sumPercentInAchievements
} from './../achievements/'
import { parseSuppliesWithEiqTotal } from '../supplies'

export const calculateEIQAndPorcentTotal = (activities) =>
  activities.map(calculateEiqOfActivity)

export const calculateEiqOfActivity = (activity) => {
  const { achievements, supplies } = activity
  const newSupplies = parseSuppliesWithEiqTotal(supplies)
  const newAchievements = parseSuppliesWithEiqTotalInAchievements(achievements)
  const percentTotal = sumPercentInAchievements(newAchievements)
  const eiqPlafined = newSupplies.length ? sumEIQInSupplies(newSupplies) : 0
  const eiqApplied = newAchievements.length
    ? sumEIQInAchievements(newAchievements)
    : 0
  return {
    ...activity,
    achievements: newAchievements,
    supplies: newSupplies,
    percentTotal,
    eiqApplied,
    eiqPlafined,
    eiq: eiqApplied > 0 ? eiqApplied : eiqPlafined
  }
}

const reduceSumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
