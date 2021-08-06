import { __, setLocale } from 'i18n'
import { Activity } from '../../interfaces/activities/Activity.Interface'

export const translateActivities = (activities: Activity[], lang: string) => {
  setLocale(lang)
  const translated = activities.map((activity) => {
    const tag: string = activity.type?.tag.toLowerCase()
    const typeAgreementKey: string = activity.typeAgreement.key.toLowerCase()
    const translatedName: string = __(`activity_types.tag.${tag}`)
    const typeAgreement = {
      ...activity.typeAgreement,
      translatedName: __(`type_agreement.keys.${typeAgreementKey}`)
    }
    return {
      ...activity,
      name: translatedName,
      typeAgreement
    }
  })

  return translated
}
