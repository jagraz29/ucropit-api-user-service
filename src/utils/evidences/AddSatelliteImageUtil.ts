import {
  ResponseOkProps,
  ImageSatelliteProps
} from '../../interfaces/SatelliteImageRequest'

import LotRepository from '../../repositories/lotRepository'
import ActivityRepository from '../../repositories/activityRepository'
import FileDocumentRepository from '../../repositories/fileDocumentRepository'

/**
 * Add satellite images.
 *
 * @param ResponseOkProps[] response
 */
export const addSatelliteImageInActivity = async (
  response: Array<ResponseOkProps>
): Promise<void> => {
  for (const responseOK of response) {
    if (responseHasImages(responseOK)) {
      await responseWithImages(responseOK)
    } else {
      await responseWithoutImages(responseOK)
    }
  }
}

/**
 * Check length images response.
 *
 * @param ResponseOkProps response
 *
 * @returns
 */
const responseHasImages = (response: ResponseOkProps): boolean => {
  return response.images && response.images.length > 0
}

/**
 * Create Satellite Image Without images.
 *
 * @param ResponseOkProps response
 */
const responseWithoutImages = async (
  response: ResponseOkProps
): Promise<void> => {
  const { activityId } = response.customOptions
  const { lotId, description } = response
  const lot = await LotRepository.findById(lotId)
  const activity = await ActivityRepository.findById(activityId)

  const fileDocument = await FileDocumentRepository.create({
    meta: {
      lotId: lot._id,
      nameLot: lot.name,
      description: description
    },
    isSatelliteImage: true
  })
  activity.files.push(fileDocument)

  await activity.save()
}

/**
 * Create Satellite Image With images.
 *
 * @param ResponseOkProps response
 */
const responseWithImages = async (response: ResponseOkProps): Promise<void> => {
  const { lotId, images } = response
  const { activityId } = response.customOptions

  const lot = await LotRepository.findById(lotId)
  const activity = await ActivityRepository.findById(activityId)

  for (const image of images) {
    const { nameFile, date, type } = image
    const fileDocument = await FileDocumentRepository.create({
      nameFile: nameFile,
      date: date,
      meta: {
        lotId: lot._id,
        nameLot: lot.name,
        typeImage: type
      },
      isSatelliteImage: true
    })

    activity.satelliteImages.push(fileDocument)

    await activity.save()
  }
}
