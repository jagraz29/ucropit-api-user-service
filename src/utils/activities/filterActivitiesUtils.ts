export const filterActivities = (activities) => {
  return activities.filter(filterByActivityMakeAndFinished)
}
export const filterByActivityMakeAndFinished = (activity) => {
  if (activity.status === 'TERMINADA' || activity.status === 'REALIZADA') {
    return activity
  }
}
