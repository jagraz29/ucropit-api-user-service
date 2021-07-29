import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Joi from '@hapi/joi'
import JoiObjectId from 'joi-objectid'
Joi.objectId = JoiObjectId(Joi)

export const appliedLicensesByCropValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const Schema = Joi.object({
    id: Joi.objectId().required(),
    cropId: Joi.objectId().required()
  })

  const { error } = Schema.validate({
    ...req.params,
    ...req.body,
    ...req.query
  })

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      description: error
    })
  }

  return next()
}
