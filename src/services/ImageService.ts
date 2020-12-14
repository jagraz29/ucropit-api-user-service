import sharp from 'sharp'
import { getFullPath } from '../utils/Files'

interface ResizeImageParameters {
  path: string
  destination: string
  nameFile: string
  suffixName?: string
  width?: Number
  height?: Number
}

class ImageService {
  /**
   * Resize Image
   *
   * @param ResizeImageParameters parameters
   */
  public static async resize (parameters: ResizeImageParameters) {
    const pathImage = `${parameters.destination}/${parameters.suffixName}-${parameters.nameFile}`
    await sharp(getFullPath(parameters.path))
      .resize(parameters.width, parameters.height)
      .toFile(getFullPath(pathImage))

    return pathImage
  }

  /**
   * Create Thumbnail image.
   *
   * @param parameters
   */
  public static async createThumbnail (parameters: ResizeImageParameters) {
    const pathImageThumbnails = await this.resize({
      path: parameters.path,
      destination: parameters.destination,
      nameFile: parameters.nameFile,
      suffixName: 'thumbnail',
      width: 200,
      height: 200
    })

    return pathImageThumbnails
  }
}

export default ImageService
