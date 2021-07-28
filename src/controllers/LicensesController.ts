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
    const { cropId } = req.query
    try {
      const license = await LicenseService.licenseById({
        id,
        userId,
        cropId
      })
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
   * Sign licenses.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async sign(req: Request | any, res: Response) {
    const userId = req.user._id.toString()
    const { id } = req.params
    const { cropId } = req.body

    try {
      const license = await LicenseService.sign({
        id,
        userId,
        cropId
      })
      res.status(StatusCodes.OK).json(license)
    } catch (error) {
      console.log(error)
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

  /**
   *
   * Get Applied licenses By Crop.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async searchAppliedLicensesByCrop(
    req: Request | any,
    res: Response
  ) {
    const { id } = req.params
    const { cropId } = req.query
    const userId = req.user._id.toString()

    try {
      const license = await LicenseService.searchAppliedLicensesByCrop({
        id,
        userId,
        cropId
      })

      res.status(StatusCodes.OK).json(license)
    } catch (error) {
      console.log(error)
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
   * Apply license.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public static async apply(req: Request | any, res: Response) {
    const { id } = req.params
    const { cropId, companyIdentifier, lots } = req.body
    const userId = req.user._id.toString()

    try {
      const license = await LicenseService.apply({
        id,
        userId,
        cropId,
        companyIdentifier,
        lots
      })

      res.status(StatusCodes.OK).json(license)
    } catch (error) {
      console.log(error)
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
