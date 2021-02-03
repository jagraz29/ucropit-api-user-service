import { Request, Response } from 'express'
import ExporterService from '../services/ExporterService'
import CropService from '../services/CropService'
import UserConfigService from '../services/UserConfigService'

class ExporterController {
  /**
   *
   * @param Request req
   * @param Response res
   */
  public async cropData(req: Request | any, res: Response) {
    const { ids } = req.query

    const crops = await CropService.getCropsByIds(ids)

    res.status(200).json(crops)
  }

  /**
   * Export data crop to third party service.
   *
   * @param req
   * @param res
   */
  public async exporterCrops(req: Request, res: Response) {
    const token: string = req.get('authorization').split(' ')[1]
    const user: any = req.user
    const data = req.body

    const userConfig = await UserConfigService.findById(user.config)

    await CropService.addServiceSynchronized(data)

    const result = await ExporterService.export(
      {
        ...data,
        token: token,
        identifier: userConfig.companySelected.identifier
      },
      `${process.env.ADAPTER_URL}/${process.env.ENDPOINT_EXPORTER_CROPS}`
    )

    await CropService.changeStatusSynchronized(result)

    res.status(200).json('Ok')
  }
}

export default new ExporterController()
