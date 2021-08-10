import { __, setLocale } from 'i18n'
import { Activity } from '../../interfaces/activities/Activity.Interface'

export const translateActivities = (activities: Activity[], lang: string) => {
  setLocale(lang)
  const translated = activities.map((activity) => {
    const tag: string = activity.type?.tag.toLowerCase()
    const status: string = activity.status[0]?.name?.en.toLowerCase()
    const typeAgreementKey: string = activity.typeAgreement
      ? activity.typeAgreement.key.toLowerCase()
      : null
    const translatedName: string = __(`activity_types.tag.${tag}`)
    const translateStatus: string = __(`activity_status.status.${status}`)

    return {
      ...activity,
      name: translatedName,
      statusLabel: translateStatus,
      typeAgreement: {
        ...activity.typeAgreement,
        translatedName: typeAgreementKey
          ? __(`type_agreement.keys.${typeAgreementKey}`)
          : null
      }
    }
  })

  return translated
}
