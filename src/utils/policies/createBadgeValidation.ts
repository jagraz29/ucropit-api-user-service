import { Request, Response, NextFunction } from 'express'
import { BadgeTypes } from '../../interfaces'
import * as Joi from 'joi'

export const createBadgeValidationPolicy = (req: Request | any, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    type: Joi.string().required().valid(...Object.values(BadgeTypes)),
    nameEs: Joi.string().required(),
    nameEn: Joi.string().required(),
    namePt: Joi.string().required(),
    goalReach: Joi.number().required(),
    image: Joi.string().required(),
  })

  const { error } = schema.validate(req.body)

  if(error){
    return res.status(404).json(error)
  }

  return next()
}
