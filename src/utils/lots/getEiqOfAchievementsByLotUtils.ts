export const getEiqOfAchievementsByLot = (lotId,activitiesWithEiq): number => {
  return activitiesWithEiq.reduce(
    (a,{ achievements }) => {
      const eiqAchievements = achievements.reduce((a,{ lots,eiq }) => {
        const lot = lots.find(({ _id }) => lotId.toString() === _id.toString())
        if (lot) {
          return a + eiq
        } else {
          return 0
        }
      },0)
      return a + eiqAchievements
    },0)
}
