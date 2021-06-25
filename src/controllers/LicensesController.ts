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
   * Get licenses By Crop Type.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
    public static async licensebyId(req: Request | any, res: Response) {
      const userId = req.user._id
      const { id } = req.params
      try {
        const licenses = await LicenseService.licensebyId({userId, id})
        res.status(StatusCodes.OK).json(licenses)
      } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR
        })
      }
    }

    /**
   *
   * Get licenses By Crop Type.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
     public static async searchByCropType(req: Request | any, res: Response) {
      const { cropId } = req.query
      const userId = req.user._id.toString()
      try {
        const licenses = await LicenseService.searchByCropType({userId,cropId})
        res.status(StatusCodes.OK).json(licenses)
      } catch (error) {
        console.log(error);
        res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
          error: ReasonPhrases.INTERNAL_SERVER_ERROR
        })
      }

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
