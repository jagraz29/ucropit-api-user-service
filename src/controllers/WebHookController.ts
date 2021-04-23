import { Request, Response } from 'express'
import {
  ResponseOkProps,
  ImageSatelliteProps
} from '../interfaces/SatelliteImageRequest'
import models from '../models'

const Lot = models.Lot
const SatelliteFile = models.SatelliteFile
const FileDocument = models.FileDocument

class WebHookController {
  /**
   * Callback Sensing Satellite Images Lot.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async sensingSatelliteCallback(
    req: Request,
    res: Response
  ): Promise<void> {
    const content: Array<ResponseOkProps> = req.body

    for (const responseOK of content) {
      const lot = await Lot.findById(responseOK.lotId)

      const satelliteImages = responseOK.images.map(
        async (data: ImageSatelliteProps) => {
          const fileDocument = await FileDocument.create({
            nameFile: data.nameFile,
            date: data.date
          })
          return SatelliteFile.create({
            status: responseOK.status_ok,
            date: data.date,
            typeImage: data.type,
            file: fileDocument._id
          })
        }
      )
      const satelliteFiles = await Promise.all(satelliteImages)

      lot.satelliteFiles = satelliteFiles
      await lot.save()
    }

    res.status(200).json('Ok')
  }
}
export default new WebHookController()
