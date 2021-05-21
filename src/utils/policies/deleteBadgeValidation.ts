import { Request, Response, NextFunction } from 'express'
import * as Joi from 'joi'

export const deleteBadgeValidationPolicy = (req: Request | any, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    badgeId: Joi.string().required(),
  })

  const { error } = schema.validate(req.params)

  if(error){
    return res.status(404).json(error)
  }

  return next()
}
