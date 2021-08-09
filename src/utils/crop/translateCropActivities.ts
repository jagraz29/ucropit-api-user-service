import { __, setLocale } from 'i18n'
import { Crop } from '../../interfaces'
import { translateActivities } from '../activities'

export const translateCropActivities = (crop: Crop, lang: string) => {
  setLocale(lang)
  const pending = translateActivities(crop.pending, lang)
  const toMake = translateActivities(crop.toMake, lang)
  const done = translateActivities(crop.done, lang)
  const finished = translateActivities(crop.finished, lang)
  return {
    ...crop,
    toMake,
    pending,
    done,
    finished
  }
}
