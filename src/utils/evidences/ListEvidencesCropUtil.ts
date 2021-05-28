import { flatten } from 'lodash'
import { Evidence } from '../../interfaces/Evidence'
export const listEvidencesCrop = (crop): Evidence[] => {
  const activities = [...crop.done, ...crop.finished]

  const filesEvidences = flatten(
    activities.map((activity) => {
      return [...activity.files]
    })
  )

  return filesEvidences
}
