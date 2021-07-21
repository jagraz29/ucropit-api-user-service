import moment from 'moment'

export function isNowGreaterThan(date: Date): boolean {
  const dateCompare = new Date()
  const now = new Date(
    Date.UTC(
      dateCompare.getFullYear(),
      dateCompare.getMonth(),
      dateCompare.getDate()
    )
  )

  return now > date
}

export function compareDate(dateFirst: Date, dateLast: Date): boolean {
  return dateFirst > dateLast
}

export function formatDate(date: Date, format: string, lang?) {
  return moment(date)
    .locale(lang || 'es')
    .format(format)
}
