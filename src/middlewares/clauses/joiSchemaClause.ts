import * as Joi from 'joi'

export const joiSchemaClause = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  image: Joi.string().optional()
})
