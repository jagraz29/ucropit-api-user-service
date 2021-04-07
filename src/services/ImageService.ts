import sharp from 'sharp'
import { getFullPath } from '../utils/Files'

interface ResizeImageParameters {
  path: string
  destination: string
  nameFile: string
  suffixName?: string
  width?: Number
  height?: Number
  fit?: string
}

class ImageService {
  /**
   * Resize Image
   *
   * @param ResizeImageParameters parameters
   */
  public static async resize(parameters: ResizeImageParameters) {
    const pathImage = `${parameters.destination}/${parameters.suffixName}-${parameters.nameFile}`
    await sharp(getFullPath(parameters.path))
      .resize(parameters.width, parameters.height, {
        fit: parameters.fit || 'cover',
      })
      .toFile(getFullPath(pathImage))

    return {
      path: pathImage,
      nameFile: `${parameters.suffixName}-${parameters.nameFile}`,
    }
  }

  /**
   * Create Thumbnail image.
   *
   * @param parameters
   */
  public static async createThumbnail(parameters: ResizeImageParameters) {
    const thumbnails = await this.resize({
      path: parameters.path,
      destination: parameters.destination,
      nameFile: parameters.nameFile,
      suffixName: 'thumbnail',
      width: 200,
      height: 200,
      fit: 'cover',
    })

    return thumbnails
  }
}

export default ImageService
