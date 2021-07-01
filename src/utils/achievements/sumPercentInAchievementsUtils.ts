const sumPercent = (current, { percent = 0 }) => current + percent
export const sumPercentInAchievements = (achievements) => {
  const percentTotal = achievements.reduce(sumPercent, 0)
  return percentTotal
}
