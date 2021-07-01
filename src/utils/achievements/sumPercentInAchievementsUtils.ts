const reduceSumPercent = (current, { percent = 0 }) => current + percent
export const sumPercentInAchievements = (achievements) =>
  achievements.reduce(reduceSumPercent, 0)
