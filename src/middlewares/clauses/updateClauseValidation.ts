import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import * as Joi from 'joi'
import JoiObjectId from "joi-objectid";
const JoiValidation = JoiObjectId(Joi)

export const updateClauseValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    id: JoiValidation.objectId().required(),
    title: Joi.string().optional(),
    description: Joi.string().optional(),
    image: Joi.string().optional()
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
