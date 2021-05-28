import { UserAuth, UserTypes } from '../../interfaces'

export const getCropBadgesByUserType = (
  { _id }: UserAuth,
  { badges, members }
) => {
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
    return badges
  }

  /*
  RETURN ONLY BADGES ALLOWED FOR THAT USER TYPE
  */
  return badges.filter((badge) => {
    if (!badge.typeAgreement?.visible) return false

    if (badge.typeAgreement.visible.includes(memberData.identifier)) return true

    return false
  })
}
