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
  startDate = moment(startDate)
  endDate = moment(endDate)

  return activities.filter(activity => startDate.isSameOrBefore(activity.dateStart) && endDate.isSameOrBefore(activity.dateEnd))

}
