import { Request, Response } from 'express'
import {
  ResponseOkProps,
  ResponseFailure
} from '../interfaces/SatelliteImageRequest'

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
    const content: ResponseOkProps[] | ResponseFailure = req.body

    console.log(content)

    res.status(200).json('Ok')
  }
}
export default new WebHookController()
