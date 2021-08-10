import i18n from 'i18n'
import { addLotInTagsArray, findTagInCrop } from '../activities'

export const groupedLotsByTagsInAchievements = (
  achievements,
  lotsPlanned,
  lotsInCropData,
  lang
) =>
  achievements.map((achievement) => {
    const { lots, lotsWithSurface = [], surface } = achievement
    const lotsAchievement = achievementLotsGroupedByTags(
      lots,
      lotsWithSurface,
      lotsInCropData,
      surface,
      lotsPlanned,
      lang
    )
    delete achievement.lotsWithSurface
    return {
      ...achievement,
      lots: lotsAchievement
    }
  })

export const achievementLotsGroupedByTags = (
  lots,
  lotsWithSurface = [],
  lotsInCropData,
  surface,
  lotsPlanned,
  lang
) => {
  let surfaceAchievement = 0
  let tagsArray = []
  let lotsList = lots
  if (lotsWithSurface.length) {
    lotsList = lotsWithSurface
  } else {
    surfaceAchievement = surface / lots.length
  }
  i18n.setLocale(lang)
  for (let lot of lotsList) {
    const tagInCrop = findTagInCrop(lotsInCropData, lot)
    const tagName =
      lot.tag || (tagInCrop ? tagInCrop.tag : i18n.__('commons.tag_general'))
    if (!lot.lot) {
      lot = {
        lot,
        tag: tagName,
        surfacePlanned: findSurfacePlanned(tagName, lot, lotsPlanned),
        surfaceAchievement
      }
    }
    tagsArray = addLotInTagsArray(tagName, lot, tagsArray)
  }
  return tagsArray
}

const findSurfacePlanned = (tagName, lot, lotsPlanned) => {
  lot = lot.lot ? lot.lot : lot
  let surfacePlanned = 0
  const lotInPlanned = lotsPlanned.find(
    (lotInPlanned) => lotInPlanned.tag === tagName
  )
  if (lotInPlanned) {
    const lotInTag = lotInPlanned.lots.find(
      (lotInTag) => lotInTag.lot._id.toString() == lot._id.toString()
    )
    if (lotInTag) {
      surfacePlanned = lotInTag.surfacePlanned
    }
  }
  return surfacePlanned
}
