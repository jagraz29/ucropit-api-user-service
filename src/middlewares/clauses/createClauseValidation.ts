import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { joiSchemaClause } from '.'

export const createClauseValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {

  const { error } = joiSchemaClause.validate({ ...req.params, ...req.body })

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      description: error
    })
  }

  return next()
}
