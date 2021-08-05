import { __, setLocale } from 'i18n'
import { Activity } from '../../interfaces/activities/Activity.Interface'

export const translateActivities = (activities: Activity[], lang: string) => {
  setLocale(lang)
  const translated = activities.map((activity) => {
    const tag: string = activity.type?.tag.toLowerCase()
    const translatedName: string = __(`activity_types.tag.${tag}`)
    return {
      ...activity,
      name: translatedName
    }
  })

  return translated
}
