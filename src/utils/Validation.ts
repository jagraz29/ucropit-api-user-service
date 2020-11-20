import * as Joi from 'joi'

import JoiDate from '@hapi/joi-date'

const JoiValidation = Joi.extend(JoiDate)

export const validateCropStore = async (crop) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    pay: Joi.number().required(),
    surface: Joi.number().required(),
    dateCrop: JoiValidation.date().required(),
    dateHarvest: JoiValidation.date().greater(Joi.ref('dateCrop')).required(),
    cropType: Joi.string().required(),
    unitType: Joi.string().required(),
    identifier: Joi.string().required(),
    lots: Joi.array()
      .items(
        Joi.object().keys({
          names: Joi.array().items(Joi.string()).required(),
          tag: Joi.string().required()
        })
      )
      .required()
  })

  return schema.validateAsync(crop)
}

export const validateActivityStore = async (activity) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().greater(Joi.ref('dateStart')).optional(),
    dateLimitValidation: Joi.date().optional(),
    surface: Joi.number().required(),
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
          typeId: Joi.string().required(),
          icon: Joi.string().optional(),
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
    signers: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
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
    surface: Joi.number().optional(),
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
          typeId: Joi.string().required(),
          icon: Joi.string().optional(),
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
    signers: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
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
    addressFloor: Joi.string().allow('').optional(),
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

export const validateCompanyUpdate = async (company) => {
  const schema = Joi.object({
    identifier: Joi.string().optional(),
    typePerson: Joi.string().optional(),
    name: Joi.string().optional(),
    address: Joi.string().optional(),
    addressFloor: Joi.string().allow('').optional(),
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

export const validateAchievement = async (achievement) => {
  const schema = Joi.object({
    dateAchievement: Joi.date().required(),
    surface: Joi.string().required(),
    lots: Joi.array().items(Joi.string()).required(),
    activity: Joi.string().required(),
    crop: Joi.string().required(),
    supplies: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          unit: Joi.string().required(),
          quantity: Joi.number().required(),
          typeId: Joi.string().required(),
          icon: Joi.string().optional(),
          total: Joi.number().required()
        })
      )
      .optional(),
    evidences: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          description: Joi.string().required(),
          date: Joi.date().required(),
          settings: Joi.optional()
        })
      )
      .optional(),
    signers: Joi.array()
      .items(
        Joi.object().keys({
          userId: Joi.string().required(),
          fullName: Joi.string().required(),
          email: Joi.string().required(),
          type: Joi.string().required()
        })
      )
      .optional()
  })

  return schema.validateAsync(achievement)
}

export const validateSignAchievement = async (dataSign) => {
  const schema = Joi.object({
    activityId: Joi.string().required()
  })

  return schema.validateAsync(dataSign)
}

export const validateFilesWithEvidences = (files, evidences) => {
  if (!files && !evidences) {
    return { error: false }
  }

  if ((files && !evidences) || (!files && evidences)) {
    return { error: true, message: 'Not complete evidences' }
  }

  if (!Array.isArray(files.files)) {
    files.files = [files.files]
  }

  if (files.files.length !== evidences.length) {
    return { error: true, message: 'Length files and evidences must equal' }
  }

  return { error: false }
}
