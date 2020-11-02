import moment from 'moment'

export function isNowGreaterThan (date: Date): boolean {
  const now = moment()

  const dateMoment = moment(date)

  return now >= dateMoment
}
