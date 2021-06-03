import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import * as Joi from 'joi'
import ErrorResponse, { ErrorResponseInstance } from '../ErrorResponse'

const messages = {
  identifier: 'El CUIT es requerido para continuar con la operación',
  dateCrop: 'Debe ingresar una fecha en el valor ‘Fecha de cultivo’.'
}
export const getLotsPolicy = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    identifier: Joi.number().required(),
    dateCrop: Joi.date().required()
  })

  const { error } = schema.validate(req.query)

  if (error) {
    let field = error.details[0].path[0]

    return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(ErrorResponseInstance.parseError(ErrorResponse.REQUIRED_FIELDS, messages[field], {
      description: ReasonPhrases.BAD_REQUEST,
      error
    }))
  }

  return next()
}
