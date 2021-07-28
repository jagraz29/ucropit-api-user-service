import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Joi from '@hapi/joi'
import JoiObjectId from 'joi-objectid'
Joi.objectId = JoiObjectId(Joi)

export const applyLicenseValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const Schema = Joi.object({
    id: Joi.objectId().required(),
    cropId: Joi.objectId().required(),
    companyIdentifier: Joi.string().required(),
    lots: Joi.array().items(Joi.objectId().required()).required()
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
