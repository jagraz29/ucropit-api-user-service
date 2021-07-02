const reduceSumPercent = (current, { percent }) => current + (percent || 0)
export const sumPercentInAchievements = (achievements) =>
  achievements.reduce(reduceSumPercent, 0)
