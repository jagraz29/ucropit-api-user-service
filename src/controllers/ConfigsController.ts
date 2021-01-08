import { Request, Response } from 'express'
import UserConfigService from '../services/UserConfigService'

class ConfigsController {
  /**
   * Update Configuration User.
   *
   * @param Request req
   * @param Response res
   *
   * @returns Response
   */
  public async update(req: Request, res: Response) {
    const { id } = req.params

    const configUser = await UserConfigService.update(id, req.body, req.user)

    res.status(200).json(configUser)
  }

  /**
   * Update companySelected configure user.
   *
   * @param Request req
   * @param Response res
   *
   * @returns Response
   */
  public async updateSelectedCompany(req: Request, res: Response) {
    const { id } = req.params
    const { identifier } = req.query

    const configUser = await UserConfigService.update(id, req.body, req.user)

    const indexCompany = configUser.companies.findIndex(
      (company) => company.identifier === identifier
    )
    if (indexCompany === -1) return res.status(404).json('identifier not found')

    configUser.companies[indexCompany].company =
      configUser.config.companySelected._id

    await configUser.save()

    res.status(200).json(configUser)
  }
}

export default new ConfigsController()
