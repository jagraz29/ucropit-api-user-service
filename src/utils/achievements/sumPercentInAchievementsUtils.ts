

const sumPercent = (achievement, current) => current + achievement.percent
export const sumPercentInAchievements = (achievements) => achievements.reduce(sumPercent, 0)
