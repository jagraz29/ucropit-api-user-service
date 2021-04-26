import {
  ResponseOkProps,
  ImageSatelliteProps
} from '../../interfaces/SatelliteImageRequest'

import LotRepository from '../../repositories/lotRepository'
import FileDocumentRepository from '../../repositories/fileDocumentRepository'

/**
 * Add satellite images.
 *
 * @param ResponseOkProps[] response
 */
export const addSatelliteImageInLots = async (
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
  const lot = await LotRepository.findById(response.lotId)
  const satelliteFile = await FileDocumentRepository.createSatelliteImage({
    status: response.status_ok,
    description: response.description
  })
  lot.satelliteFiles.push(satelliteFile)
  await lot.save()
}

/**
 * Create Satellite Image With images.
 *
 * @param ResponseOkProps response
 */
const responseWithImages = async (response: ResponseOkProps): Promise<void> => {
  const lot = await LotRepository.findById(response.lotId)

  const satelliteImages = response.images.map(
    async ({ nameFile, date, type }: ImageSatelliteProps) => {
      const fileDocument = await FileDocumentRepository.create({
        nameFile: nameFile,
        date: date,
        isSatelliteImage: true
      })
      return FileDocumentRepository.createSatelliteImage({
        status: response.status_ok,
        date: date,
        typeImage: type,
        file: fileDocument._id
      })
    }
  )
  const satelliteFiles = await Promise.all(satelliteImages)

  lot.satelliteFiles = satelliteFiles
  await lot.save()
}
