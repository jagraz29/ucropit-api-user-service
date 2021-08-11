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
    identifier: Joi.string().required(),
    dateCrop: Joi.date().required()
  })

  const { error } = schema.validate(req.query)

  const messages = {
    identifier: req.__('lots.erros.invalid_identifier'),
    dateCrop: req.__('lots.erros.date_crop')
  }

  if (error) {
    const field = error.details[0].path[0]

    return res.status(StatusCodes.BAD_REQUEST).json(
      ErrorResponseInstance.parseError(
        ErrorResponse.REQUIRED_FIELDS,
        messages[field],
        {
          description: ReasonPhrases.BAD_REQUEST,
          error
        }
      )
    )
  }

  return next()
}
