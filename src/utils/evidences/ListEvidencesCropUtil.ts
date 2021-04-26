import { flatten } from 'lodash'
export const listEvidencesCrop = (crop) => {
  const activities = [...crop.done, ...crop.finished]

  const filesEvidences = flatten(
    activities.map((activity) => {
      return [...activity.files, ...activity.satelliteImages]
    })
  )

  return filesEvidences
}
