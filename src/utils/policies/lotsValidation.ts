import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import * as Joi from 'joi'
import ErrorResponse, { ErrorResponseInstance } from '../ErrorResponse'

export const getLotsPolicy = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    identifier: Joi.number().required(),
    dateCrop: Joi.date(),
    dateHarvest: Joi.date()
  })

  const { error } = schema.validate(req.query)

  if (error) {
    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(ErrorResponseInstance.parseError(ErrorResponse.REQUIRED_FIELDS, ReasonPhrases.BAD_REQUEST, {error}))
  }

  return next()
}
