import { flatten } from 'lodash'
import { Evidence } from '../../interfaces'
import {
  VALID_FORMATS_FILES_IMAGES_PNG,
  VALID_FORMATS_FILES_IMAGES_JPG,
  VALID_FORMATS_FILES_DOCUMENTS
} from '../Constants'
export const listEvidencesCrop = (crop): Evidence[] => {
  const activities = [...crop.done, ...crop.finished]

  const filesEvidences = flatten(
    activities.map((activity) => {
      return [...activity.files]
    })
  )

  return filesEvidences
}

export const getEvidencePdf = (documents: Evidence[]) => {
  const listEvidences = documents
    .map(({ nameFile, path, description }) => {
      const componentFile = nameFile.split('.')
      if (componentFile[1].match(VALID_FORMATS_FILES_DOCUMENTS)) {
        return {
          path: `${process.env.BASE_URL}/${path}`,
          description: description
        }
      }
    })
    .filter((item) => item)

  return listEvidences
}

export const getEvidenceImage = (documents: Evidence[]) => {
  const listEvidences = documents
    .map(
      ({
        nameFile,
        imagePathIntermediate,
        imagePathThumbnails,
        description
      }) => {
        const componentFile = nameFile.split('.')
        if (
          componentFile[1].match(VALID_FORMATS_FILES_IMAGES_PNG) ||
          componentFile[1].match(VALID_FORMATS_FILES_IMAGES_JPG)
        ) {
          return {
            path: imagePathIntermediate,
            thumb: imagePathThumbnails,
            description: description
          }
        }
      }
    )
    .filter((item) => item)

  return listEvidences
}
