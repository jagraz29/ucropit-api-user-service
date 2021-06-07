export const filterActivities = (activities) => {
  return activities.filter(filterByActivityMakeAndFinished)
}
export const filterByActivityMakeAndFinished = (activity) => {
  if (
    (activity.status === 'REALIZADA' || activity.status === 'TERMINADA') &&
    (activity.tag === 'ACT_HARVEST' ||
      activity.tag === 'ACT_MONITORING' ||
      activity.tag === 'ACT_AGREEMENT') &&
    isCompleteSignersSign(activity.signers)
  ) {
    return activity
  }

  if (
    activity.achievements.length &&
    (activity.status === 'TERMINADA' || activity.status === 'REALIZADA')
  ) {
    return activity
  }
}

const isCompleteSignersSign = (signers) => {
  const listNotSigners = signers.filter((item) => !item.signed)

  if (listNotSigners.length) {
    return false
  }

  return true
}
