const sumPercent = (current, { percent = 0 }) => current + percent
export const sumPercentInAchievements = (achievements) =>
  achievements.reduce(sumPercent, 0)
