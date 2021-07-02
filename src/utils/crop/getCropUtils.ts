import { Numbers } from '../Numbers'
import { calculateCropVolumeUtils, getEiqFromActivityWithEiq } from '.'
import { getLots, getLotsGroupByTag } from '../lots'
import { IEiqRangesDocument } from '../../interfaces'
import { getEiqRange } from '..'

export const getCropUtils = (
  {
    surface,
    pay: payEntry,
    dateCrop,
    dateHarvest,
    name,
    activities,
    lots,
    company,
    badges,
    unitType,
    data,
    members,
    cropType: { key: cropTypeKey }
  },
  activitiesWithEiq,
  theoriticalPotential,
  eiqRanges: IEiqRangesDocument[]
) => {
  const pay = payEntry ?? 0
  let eiq: number = 0
  const { key: keyUnitType, name: nameUnitType } = unitType || {}
  eiq = getEiqFromActivityWithEiq(activitiesWithEiq)

  return {
    surface,
    volume: Numbers.roundToTwo(
      calculateCropVolumeUtils(keyUnitType, pay, surface)
    ),
    pay,
    dateCrop,
    dateHarvest,
    commercialContact: company
      ? getCommercialContact(company, theoriticalPotential)
      : null,
    cultivationManager: members.length
      ? getCultivationManager(members[0])
      : null,
    name,
    badges,
    eiq: {
      quantity: eiq,
      range: getEiqRange(eiq, eiqRanges)
    },
    cropTypeKey,
    company,
    activities,
    lotsQuantity: lots.length ? lots[0].data.length : 0,
    lots: lots.length
      ? getLots(lots[0].data, activitiesWithEiq, eiqRanges)
      : [],
    lotsGroupByTag: lots.length
      ? getLotsGroupByTag(lots, activitiesWithEiq, eiqRanges)
      : []
  }
}

export const getCultivationManager = ({ user }) => {
  const { email, firstName, lastName, phone } = user
  return { email, firstName, lastName, phone }
}

export const getCommercialContact = (company, theoriticalPotential) => {
  const { identifier, name, address, addressFloor, contacts } = company
  if (!contacts || !contacts.length) {
    return null
  }

  const {
    user: { email, firstName, lastName, phone }
  } = contacts[0]
  return {
    identifier,
    name,
    address,
    addressFloor,
    theoriticalPotential,
    email,
    firstName,
    lastName,
    phone
  }
}
