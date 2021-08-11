import { __, setLocale } from 'i18n'
import { Crop } from '../../interfaces'

export const translateCropType = (crop: Crop, lang?: string) => {
  if (lang) {
    setLocale(lang)
  }

  const key: string = crop.cropType?.key.toLowerCase()

  const keyLabel: string = __(`crop_types.keys.${key}`)

  return {
    ...crop.cropType,
    keyLabel
  }
}
