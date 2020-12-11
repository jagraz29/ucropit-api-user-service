import sharp from 'sharp'

interface ResizeImageParameters {
  path: string
  destination: string
  width: Number
  height: Number
}
class ImageService {
  /**
   * Resize Image
   *
   * @param ResizeImageParameters parameters
   */
  public async resize (parameters: ResizeImageParameters) {
    console.log('Parametros')
    console.log(parameters)
  }
}

export default new ImageService()
