import { Request, Response } from 'express'
import UserService from '../services/UserService'
import UserConfigService from '../services/UserConfigService'
import CollaboratorRequest from '../models/collaboratorRequest'

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
    const user: any = req.user

    const configUser: any = await UserConfigService.update(
      id,
      req.body,
      req.user
    )

    const indexCompany = configUser.companies.findIndex(
      (company) => company.identifier === identifier
    )
    if (indexCompany === -1) return res.status(404).json('identifier not found')

    configUser.companies[indexCompany].company =
      configUser.config.companySelected._id
    configUser.companies[indexCompany].isAdmin = false

    const request = new CollaboratorRequest({
      user: user._id,
      company: configUser.config.companySelected._id
    })

    // Update collaborator request array
    configUser.collaboratorRequest.push(request._id)

    await request.save()
    await configUser.save()

    res.status(200).json(configUser)
  }
}

export default new ConfigsController()
