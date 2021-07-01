import {
  calculateEIQSurfaceInAchievements,
  parseSuppliesWithEiqTotalInAchievements,
  sumPercentInAchievements
} from './../achievements/'
import { parseSuppliesWithEiqTotal } from '../supplies'

export const calculateEIQAndPorcentTotal = (activities) => {
  const activitiesWithEIQAndPercentTotal = activities.map((activity) => {
    const { achievements, supplies } = activity
    const newAchievements =
      parseSuppliesWithEiqTotalInAchievements(achievements)
    const percentTotal = sumPercentInAchievements(newAchievements)
    const eiq = calculateEIQSurfaceInAchievements(newAchievements)
    return {
      ...activity,
      achievements: newAchievements,
      supplies: parseSuppliesWithEiqTotal(supplies),
      percentTotal,
      eiq: eiq || 40 // Todo: quitar este valor para el calculo correcto del eiq
    }
  })

  return activitiesWithEIQAndPercentTotal
}
