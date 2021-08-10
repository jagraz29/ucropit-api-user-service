import { IBadge, UserAuth, UserTypes } from '../../interfaces'
import { __, setLocale } from 'i18n'

export const getCropBadgesByUserType = (
  { _id }: UserAuth,
  { badges, members },
  lang: string
) => {
  setLocale(lang)
  const translatedBadges = badges.map((badge: any) => {
    const typeBadge: string = badge.badge.type
      ? badge.badge.type.toLowerCase()
      : null
    return {
      ...badge,
      translatedName: typeBadge
        ? __(`type_badge.types.${typeBadge}`)
        : typeBadge
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
