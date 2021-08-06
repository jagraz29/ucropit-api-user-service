import { IBadge, UserAuth, UserTypes } from '../../interfaces'
import { __, setLocale } from 'i18n'

export const getCropBadgesByUserType = (
  { _id }: UserAuth,
  { badges, members },
  lang: string
) => {
  setLocale(lang)
  const translatedBadges = badges.map((badge: IBadge) => {
    const type: string = badge.type.toLocaleLowerCase()
    return {
      ...badge,
      translatedName: __(`type_badge.types.${type}`)
    }
  })
  /*
  GET MEMBER DATA OF USER IN CROP
  */
  const memberData = members.filter(
    (member) => _id.toString() === member.user._id.toString()
  )[0]

  /*
  VALIDATE USER TYPE
  */
  if (
    memberData.type !== UserTypes.MARKETER &&
    memberData.type !== UserTypes.PROVIDER
  ) {
    return translatedBadges
  }

  /*
  RETURN ONLY BADGES ALLOWED FOR THAT USER TYPE
  */
  return translatedBadges.filter((badge) => {
    if (!badge.typeAgreement?.visible) return false

    if (badge.typeAgreement.visible.includes(memberData.identifier)) return true

    return false
  })
}
