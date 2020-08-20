import * as Joi from 'joi'

export const validateCropStore = async (crop) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    pay: Joi.number().required(),
    surface: Joi.number().required(),
    dateCrop: Joi.date().optional().required(),
    dateHarvest: Joi.date().greater(Joi.ref('dateCrop')).required(),
    cropType: Joi.object({
      name: Joi.string().required()
    }).required(),
    unitType: Joi.object({
      name: Joi.string().required(),
      key: Joi.string().required()
    }).required(),
    lots: Joi.array().items(Joi.string()).optional(),
    company: Joi.string().optional()
  })

  return schema.validateAsync(crop)
}
