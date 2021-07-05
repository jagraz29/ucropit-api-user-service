import { calculateActivityEiq } from '../'

<<<<<<< HEAD
export const calculateCropEiq = activities => {
  return activities.reduce((a,{ achievements }) => {
    return a + calculateActivityEiq(achievements)
  },0)
=======
export const calculateCropEiq = async (activities) => {
  let cropEiq = 0

  activities.map(({ achievements }) => {
    let activityEiq = 0

    achievements.map((achievement) => {
      const achievementEiq: number = calculateEIQSurfaceAchievement(achievement)

      activityEiq += achievementEiq
    })

    cropEiq += activityEiq
  })

  return cropEiq
>>>>>>> develop
}
