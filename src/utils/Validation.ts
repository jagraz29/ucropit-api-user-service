import * as Joi from 'joi'
import { FileArray } from 'express-fileupload'
import { handleFileConvertJSON } from '../utils/ParseKmzFile'
import { errors } from '../types/common'
import { VALID_FORMATS_DOCUMENTS } from './Files'
import _ from 'lodash'

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
    _id: Joi.string().optional(),
    name: Joi.string().required(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().min(Joi.ref('dateStart')).optional(),
    dateLimitValidation: Joi.date().optional(),
    dateHarvest: Joi.date().optional(),
    surface: Joi.number().optional(),
    type: Joi.string().required(),
    typeAgreement: Joi.string().optional(),
    status: Joi.string().optional(),
    lots: Joi.array().items(Joi.string()).optional(),
    crop: Joi.string().optional(),
    dateObservation: Joi.date().optional(),
    unitType: Joi.string().optional(),
    pay: Joi.number().optional(),
    observation: Joi.string().optional(),
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
          name: Joi.string().optional(),
          description: Joi.string().required(),
          date: Joi.date().required(),
          settings: Joi.optional(),
          meta: Joi.optional()
        })
      )
      .optional(),
    storages: Joi.array()
      .items(
        Joi.object().keys({
          unitType: Joi.string().required(),
          tonsHarvest: Joi.number().required(),
          storageType: Joi.string().required(),
          icon: Joi.string().optional(),
          label: Joi.string().optional()
        })
      )
      .optional(),
    signers: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        type: Joi.string().required(),
        signed: Joi.boolean().optional()
      })
    )
  })

  return schema.validateAsync(activity)
}

export const validateActivityUpdate = async (activity) => {
  const schema = Joi.object({
    name: Joi.string().optional(),
    dateStart: Joi.date().optional(),
    dateEnd: Joi.date().min(Joi.ref('dateStart')).optional(),
    dateLimitValidation: Joi.date().optional(),
    dateHarvest: Joi.date().optional(),
    surface: Joi.number().optional(),
    type: Joi.string().optional(),
    typeAgreement: Joi.string().optional(),
    dateObservation: Joi.date().optional(),
    unitType: Joi.string().optional(),
    pay: Joi.number().optional(),
    observation: Joi.string().optional(),
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
          name: Joi.string().optional(),
          description: Joi.string().required(),
          date: Joi.date().required(),
          settings: Joi.optional(),
          meta: Joi.optional()
        })
      )
      .optional(),
    storages: Joi.array()
      .items(
        Joi.object().keys({
          unitType: Joi.string().required(),
          tonsHarvest: Joi.number().required(),
          storageType: Joi.string().required(),
          icon: Joi.string().optional(),
          label: Joi.string().optional()
        })
      )
      .optional(),
    signers: Joi.array().items(
      Joi.object().keys({
        userId: Joi.string().required(),
        fullName: Joi.string().required(),
        email: Joi.string().required(),
        type: Joi.string().required(),
        signed: Joi.boolean().optional()
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
    _id: Joi.string().optional(),
    dateAchievement: Joi.date().required(),
    surface: Joi.number().required(),
    lots: Joi.array().items(Joi.string()).required(),
    activity: Joi.string().required(),
    crop: Joi.string().required(),
    erpAgent: Joi.string().optional(),
    supplies: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().required(),
          unit: Joi.string().required(),
          quantity: Joi.number().required(),
          typeId: Joi.string().optional(),
          icon: Joi.string().optional(),
          total: Joi.number().required()
        })
      )
      .optional(),
    destination: Joi.array()
      .items(
        Joi.object().keys({
          unitType: Joi.string().required(),
          tonsHarvest: Joi.number().required(),
          destinationAddress: Joi.string().required(),
          icon: Joi.string().optional(),
          label: Joi.string().optional()
        })
      )
      .optional(),
    evidences: Joi.array()
      .items(
        Joi.object().keys({
          name: Joi.string().optional(),
          description: Joi.string().required(),
          date: Joi.date().required(),
          settings: Joi.optional(),
          meta: Joi.optional()
        })
      )
      .optional(),
    signers: Joi.array()
      .items(
        Joi.object().keys({
          userId: Joi.string().required(),
          fullName: Joi.string().required(),
          email: Joi.string().required(),
          type: Joi.string().required(),
          signed: Joi.boolean().optional()
        })
      )
      .optional()
  })

  return schema.validateAsync(achievement)
}

export const validateSignAchievement = async (dataSign) => {
  const schema = Joi.object({
    activityId: Joi.string().required(),
    cropId: Joi.string().required()
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

/**
 * Check kmz valid format.
 *
 * @param FileArray files
 */
export const validateFormatKmz = async (files: FileArray) => {
  const result = await handleFileConvertJSON(files)

  for (const feature of result[0].features) {
    if (feature.geometry.type !== 'Polygon') {
      return {
        error: true,
        message: 'KMZ format not allowed',
        code:
          errors.find((error) => error.key === '002')?.code ||
          'ERROR_INVALID_FORMAT_KMZ'
      }
    }
  }
  return { error: false }
}
export const validateExtensionFile = (files) => {
  if (!files) {
    return { error: false }
  }
  const isValidTypes = Object.keys(files).map((key) => {
    if (files[key].length > 0) {
      return files[key].map((file) => {
        if (!validTypes(file)) {
          return {
            error: true
          }
        }
        return {
          error: false
        }
      })
    }

    if (!validTypes(files[key])) {
      return {
        error: true
      }
    }

    return {
      error: false
    }
  })

  if (_.flatten(isValidTypes).some((check) => check.error === true)) {
    return {
      error: true,
      message: 'Any File extension not allowed',
      code:
        errors.find((error) => error.key === '003')?.code ||
        'ERROR_FILE_EXTENSION'
    }
  }

  return { error: false }
}

function validTypes(file) {
  return file.mimetype.match(VALID_FORMATS_DOCUMENTS) !== null
}
