import { Request, Response, NextFunction } from 'express'
import { BadgeTypes } from '../../interfaces'
import * as Joi from 'joi'

export const updateBadgeValidationPolicy = (req: Request | any, res: Response, next: NextFunction) => {
  const schema = Joi.object({
    badgeId: Joi.string().required(),
    type: Joi.string().valid(...Object.values(BadgeTypes)),
    nameEs: Joi.string(),
    nameEn: Joi.string(),
    namePt: Joi.string(),
    goalReach: Joi.number(),
    image: Joi.string(),
  })

  const { error } = schema.validate({...req.params, ...req.body})

  if(error){
    return res.status(404).json(error)
  }

  return next()
}
