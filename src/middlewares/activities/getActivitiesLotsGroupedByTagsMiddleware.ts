import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import Joi from '@hapi/joi'
import JoiDate from '@hapi/joi-date'
import JoiObjectId from 'joi-objectid'

Joi.objectId = JoiObjectId(Joi)
const JoiValidation = Joi.extend(JoiDate)

export const getActivitiesLotsGroupedByTagsMiddleware = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const Schema = Joi.object({
    id: JoiValidation.objectId().required(),
    cropId: JoiValidation.objectId().required()
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
