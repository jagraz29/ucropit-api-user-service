import { Request, Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { LicenseService } from '../services'
import { errors } from '../types/common'

export class LicensesController {
  /**
   *
   * Get all licenses.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async index(req: Request | any, res: Response) {

    const licenses = await LicenseService.createLicense(req.body)

    res.status(StatusCodes.OK).json(licenses)
  }

  /**
   *
   * Create License.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async create(req: Request | any, res: Response) {
    try {
      const licenses = await LicenseService.createLicense(req.body)
      res.status(StatusCodes.CREATED).json(licenses)
    } catch (error) {
      res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
        error: ReasonPhrases.INTERNAL_SERVER_ERROR
      })
    }
  }
}
