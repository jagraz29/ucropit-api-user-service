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
  public async update (req: Request, res: Response) {
    const { id } = req.params

    const configUser = await UserConfigService.update(id, req.body)

    res.status(200).json(configUser)
  }
}

export default new ConfigsController()
