
const sumPercent = (current, achievement) => {
  return current + achievement.percent
}
export const sumPercentInAchievements = (achievements) => {
  const percentTotal = achievements.reduce(sumPercent, 0)
  return percentTotal
}
