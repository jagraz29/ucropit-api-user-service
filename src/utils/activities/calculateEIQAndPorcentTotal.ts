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
  const eiq = newAchievements.length ? sumEIQInAchievements(newAchievements) : 0
  const eiqPlafined = newSupplies.length ? sumEIQInAchievements(newSupplies) : 0
  return {
    ...activity,
    achievements: newAchievements,
    supplies: newSupplies,
    percentTotal,
    eiqPlafined,
    eiq
  }
}

const reduceSumEIQ = (current, { eiq = 0 }) => current + eiq
export const sumEIQInSupplies = (list) => list.reduce(reduceSumEIQ, 0)
