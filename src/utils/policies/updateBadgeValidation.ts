import { Request, Response, NextFunction } from 'express'
import { BadgeTypes } from '../../interfaces'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import * as Joi from 'joi'
import JoiObjectId from "joi-objectid";
const JoiValidation = JoiObjectId(Joi)

export const updateBadgeValidationPolicy = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    badgeId: JoiValidation.objectId().required(),
    type: Joi.string().valid(...Object.values(BadgeTypes)),
    nameEs: Joi.string(),
    nameEn: Joi.string(),
    namePt: Joi.string(),
    goalReach: Joi.number(),
    image: Joi.string()
  })

  const { error } = schema.validate({ ...req.params, ...req.body })

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      description: error
    })
  }

  return next()
}
