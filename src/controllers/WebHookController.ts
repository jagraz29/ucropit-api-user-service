import { Request, Response } from 'express'

class WebHookController {
  /**
   * Callback Sensing Satellite Images Lot.
   *
   * @param Request req
   * @param Response res
   */
  public async sensingSatelliteCallback(req: Request, res: Response) {
    res.status(200).json('Ok')
  }
}
export default new WebHookController()
