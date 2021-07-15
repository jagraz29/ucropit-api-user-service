import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { LicenseService } from '../services'

export class LicensesController {
  /**
   *
   * Get licenses By Crop Type.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async licenseById(req: Request | any, res: Response) {
    const userId = req.user._id.toString()
    const { id } = req.params
    try {
      const license = await LicenseService.licenseById({ userId, id })
      res.status(StatusCodes.OK).json(license)
    } catch (error) {
      const {
        response: { status, data }
      } = error
      res.status(status).json({
        error: data.message,
        code: data.code
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
    try {
      const { cropId } = req.query
      const userId = req.user._id.toString()
      const licenses = await LicenseService.searchByCropType({ userId, cropId })
      res.status(StatusCodes.OK).json(licenses)
    } catch (error) {
      const {
        response: { status, data }
      } = error
      res.status(status).json({
        error: data.message,
        code: data.code
      })
    }
  }
}
