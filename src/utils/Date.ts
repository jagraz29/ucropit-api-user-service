import moment from 'moment'

export function isNowGreaterThan (date: Date): boolean {
  const now = moment()

  const dateMoment = moment(date)

  if (now > dateMoment) {
    return true
  }

  return false
}
