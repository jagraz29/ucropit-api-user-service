export function isNowGreaterThan (date: Date): boolean {
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
