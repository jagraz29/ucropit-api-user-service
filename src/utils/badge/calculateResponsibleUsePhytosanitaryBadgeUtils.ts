import { IBadge } from '../../interfaces'

export const calculateResponsibleUsePhytosanitaryBadge = (
  cropEiq: number,
  badge: IBadge
) => {
  if (cropEiq <= badge.goalReach) {
    return badge
  }

  return false
}
