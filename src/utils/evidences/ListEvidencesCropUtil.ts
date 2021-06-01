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

export const getEvidencePdf = (documents: Evidence[]): Array<string> => {
  const listEvidences: Array<string> = documents
    .map(({ nameFile, path }) => {
      const componentFile = nameFile.split('.')
      if (componentFile[1].match(VALID_FORMATS_FILES_DOCUMENTS)) {
        return `${process.env.BASE_URL}/${path}`
      }
    })
    .filter((item) => item)

  return listEvidences
}

export const getEvidenceImage = (documents: Evidence[]): Array<string> => {
  const listEvidences: Array<string> = documents
    .map(({ nameFile, imagePathIntermediate }) => {
      const componentFile = nameFile.split('.')
      if (
        componentFile[1].match(VALID_FORMATS_FILES_IMAGES_PNG) ||
        componentFile[1].match(VALID_FORMATS_FILES_IMAGES_JPG)
      ) {
        return imagePathIntermediate
      }
    })
    .filter((item) => item)

  return listEvidences
}
