import { calculateEIQSurfaceAchievement } from '..'

export const calculateActivityEiq = (achievements) => {
  return achievements.reduce((a, achievement) => {
    return a + calculateEIQSurfaceAchievement(achievement)
  }, 0)
}
