import { DIR_FOLDER_DEFAULT_IMAGES } from '../utils/Files'

export const parseImageUrl = (imagePath) => {

  return `${ process.env.BASE_URL }${ imagePath }`

}

export const parseImageUrlDefault = (imageName) => {

  return `${ process.env.BASE_URL }${ DIR_FOLDER_DEFAULT_IMAGES.replace('public', '') }/${imageName}`

}
