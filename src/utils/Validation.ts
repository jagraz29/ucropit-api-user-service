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
    lots: Joi.object({
      names: Joi.array().items(Joi.string()).required(),
      tag: Joi.string().required()
    }).required(),
    company: Joi.string().required()
  })

  return schema.validateAsync(crop)
}

export const validateActivityStore = async (activity) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().greater(Joi.ref('dateStart')).optional(),
    dateLimitValidation: Joi.date().optional(),
    surface: Joi.string().required(),
    type: Joi.string().required(),
    typeAgreement: Joi.string().optional(),
    status: Joi.string().optional(),
    lots: Joi.array().items(Joi.string()).optional(),
    crop: Joi.string().optional(),
    supplies: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          unit: Joi.string().required(),
          quantity: Joi.number().required(),
          total: Joi.number().required()
        })
      )
      .optional(),
    evidences: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().required(),
          date: Joi.date().required()
        })
      )
      .optional(),
    collaborators: Joi.array().items(
      Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        type: Joi.string().required()
      })
    )
  })

  return schema.validateAsync(activity)
}

export const validateActivityUpdate = async (activity) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().greater(Joi.ref('dateStart')).optional(),
    dateLimitValidation: Joi.date().optional(),
    surface: Joi.string().optional(),
    type: Joi.string().optional(),
    typeAgreement: Joi.string().optional(),
    status: Joi.string().optional(),
    lots: Joi.array().items(Joi.string()).optional(),
    crop: Joi.string().optional(),
    supplies: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          unit: Joi.string().required(),
          quantity: Joi.number().required(),
          total: Joi.number().required()
        })
      )
      .optional(),
    evidences: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().required(),
          date: Joi.date().required()
        })
      )
      .optional(),
    collaborators: Joi.array().items(
      Joi.object().keys({
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        type: Joi.string().required()
      })
    )
  })

  return schema.validateAsync(activity)
}

export const validateCompanyStore = async (company) => {
  const schema = Joi.object({
    identifier: Joi.string().required(),
    typePerson: Joi.string().optional(),
    name: Joi.string().required(),
    address: Joi.string().required(),
    addressFloor: Joi.string().optional(),
    evidences: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().required(),
          date: Joi.date().required()
        })
      )
      .optional()
  })

  return schema.validateAsync(company)
}

export const validateFilesWithEvidences = (files, evidences) => {
  if ((files && !evidences) || (!files && evidences)) {
    return { error: true, message: 'Not complete evidences' }
  }

  if (files.files.length !== evidences.length) {
    return { error: true, message: 'Length files and evidences must equal' }
  }

  return { error: false }
}
