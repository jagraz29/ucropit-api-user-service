import moment from 'moment'

export const filterActivities = (activities) => {
  return activities.filter(filterByActivityMakeAndFinished)
}
export const filterByActivityMakeAndFinished = (activity) => {
  if (activity.status === 'TERMINADA' || activity.status === 'REALIZADA') {
    return activity
  }
}

export const filterActivitiesMakeByDates = (activities, startDate, endDate) => {
  if (!startDate && !endDate) return activities
  startDate = moment(startDate).startOf('day')
  endDate = moment(endDate).endOf('day')

  return activities.filter(
    (activity) =>
      moment(activity.dateStart).startOf('day').isSameOrAfter(startDate) &&
      moment(activity.dateEnd).endOf('day').isSameOrBefore(endDate)
  )
}
