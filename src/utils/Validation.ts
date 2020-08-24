import * as Joi from 'joi'

export const validateCropStore = async (crop) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    pay: Joi.number().required(),
    surface: Joi.number().required(),
    dateCrop: Joi.date().optional().required(),
    dateHarvest: Joi.date().greater(Joi.ref('dateCrop')).required(),
    cropType: Joi.string().optional(),
    unitType: Joi.string().optional(),
    lots: Joi.array().items(Joi.string()).optional(),
    company: Joi.string().optional()
  })

  return schema.validateAsync(crop)
}

export const validateCompanyStore = async (company) => {
  const schema = Joi.object({
    identifier: Joi.string().required(),
    typePerson: Joi.string().optional(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    addressFloor: Joi.string().optional()
  })

  return schema.validateAsync(company)
}
