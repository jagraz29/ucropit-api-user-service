import i18n from 'i18n'
import { groupedLotsByTagsInAchievements } from '../achievements'

export const groupedLotsByTagsInActivities = (activities, crop, lang) =>
  activities.map((activity) =>
    groupedLotsByTagsInActivity(activity, crop, lang)
  )

export const groupedLotsByTagsInActivity = (activity, crop, lang) => {
  const { achievements, lots, lotsWithSurface = [], surface } = activity
  const lotsInCropData = crop.lots
  delete activity.lotsMade
  delete activity.lotsWithSurface
  const lotsPlanned = activityLotsGroupedByTags(
    lots,
    lotsWithSurface,
    lotsInCropData,
    surface,
    lang
  )
  return {
    ...activity,
    lots: lotsPlanned,
    achievements: groupedLotsByTagsInAchievements(
      achievements,
      lotsPlanned,
      lotsInCropData,
      lang
    )
  }
}

export const activityLotsGroupedByTags = (
  lots,
  lotsWithSurface = [],
  lotsInCropData,
  surface,
  lang
) => {
  let surfacePlanned = 0
  let tagsArray = []
  let lotsList = lots
  if (lotsWithSurface.length) {
    lotsList = lotsWithSurface
  } else {
    surfacePlanned = surface / lots.length
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
        surfacePlanned
      }
    }
    tagsArray = addLotInTagsArray(tagName, lot, tagsArray)
  }
  return tagsArray
}

export const findTagInCrop = (lotsInCropData, lot) => {
  lot = lot.lot ? lot.lot : lot
  const tagInCrop = lotsInCropData.find((lotInCrop) => {
    const data = lotInCrop.data.map((id) => id.toString())
    return data.includes(lot._id.toString())
  })
  return tagInCrop
}
export const addLotInTagsArray = (tagName, lot, tagsArray) => {
  const index = tagsArray.findIndex((x) => x.tag === tagName)
  if (index !== -1) {
    tagsArray[index].lots.push(lot)
  } else {
    tagsArray.push({
      tag: tagName,
      lots: [lot]
    })
  }
  return tagsArray
}
