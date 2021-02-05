import { Request, Response } from 'express'
import IntegrationService from '../services/IntegrationService'
import CropService from '../services/CropService'
import CompanyService from '../services/CompanyService'
import UserConfigService from '../services/UserConfigService'

class IntegrationServiceController {
  /**
   * Get crop Data.
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async cropData(req: Request | any, res: Response) {
    const { ids } = req.query

    const crops = await CropService.getCropsByIds(ids)

    res.status(200).json(crops)
  }

  /**
   * Added service integration.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async create(req: Request, res: Response) {
    const data = req.body

    await IntegrationService.create(
      data,
      `${process.env.ADAPTER_URL}/${process.env.ENDPOINT_INTEGRATION_USER}`
    )

    const addedServices = await CompanyService.addServiceIntegration(
      data.erpAgent,
      data.ucropitCompanyId
    )

    if (addedServices.error) {
      return res.status(400).json('ERROR_SERVICES_INTEGRATED')
    }
    res.status(200).json('Ok')
  }

  /**
   * Export data crop to third party service.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async exporterCrops(req: Request, res: Response) {
    const token: string = req.get('authorization').split(' ')[1]
    const user: any = req.user
    const data = req.body

    const userConfig = await UserConfigService.findById(user.config)

    await CropService.addServiceSynchronized(data)

    const result = await IntegrationService.export(
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

  /**
   * Export data achievement to third party service.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async exporterAchievements(req: Request, res: Response) {
    const { cropId, activityId, achievementId } = req.params
    const user: any = req.user
    const data: any = req.body

    const crop: any = await CropService.findOneCrop(cropId)

    if (CropService.serviceCropIsSynchronized(crop, data.erpAgent)) {
      const token: string = req.get('authorization').split(' ')[1]
      const userConfig = await UserConfigService.findById(user.config)

      const response = await IntegrationService.export(
        {
          token: token,
          erpAgent: data.erpAgent,
          identifier: userConfig.companySelected.identifier,
          achievementId: achievementId,
          activityId: activityId
        },
        `${process.env.ADAPTER_URL}/${process.env.ENDPOINT_EXPORTER_ACHIEVEMENTS}`
      )

      return res.status(200).json(response)
    }

    return res.status(200).json('not achievement async')
  }
}

export default new IntegrationServiceController()
