import * as Joi from 'joi'
import { FileArray } from 'express-fileupload'
import { handleFileConvertJSON } from '../utils/ParseKmzFile'
import { errors } from '../types/common'
import { VALID_FORMATS_DOCUMENTS } from './Files'
import { ResponseOkProps } from '../interfaces/SatelliteImageRequest'
import { TypeActivity } from '../repositories'
import _ from 'lodash'

import JoiDate from '@hapi/joi-date'
import moment from 'moment'
import ErrorResponse from '../utils/ErrorResponse'

const JoiValidation = Joi.extend(JoiDate)

export const validateGetCrops = async (crop) => {
  const schema = Joi.object({
    identifier: Joi.string(),
    cropTypes: Joi.array(),
    companies: Joi.array(),
    collaborators: Joi.array(),
    cropVolume: Joi.number()
  })

  return schema.validateAsync(crop)
}

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
    lots: Joi.array().items(
      Joi.object().keys({
        names: Joi.array().items(Joi.string()).required(),
        tag: Joi.string().required()
      })
    ),
    reusableLots: Joi.array().items(
      Joi.object().keys({
        tag: Joi.string().required(),
        lotIds: Joi.array().items(Joi.string()).required()
      })
    )
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
    dateEstimatedHarvest: Joi.date().optional(),
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
        Joi.object()
          .keys({
            name: Joi.string().required(),
            unit: Joi.string().required(),
            quantity: Joi.number().required(),
            typeId: Joi.string().required(),
            supply: Joi.string().required(),
            icon: Joi.string().optional(),
            total: Joi.number().required()
          })
          .unknown()
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
          unitType: Joi.string().optional(),
          tonsHarvest: Joi.number().optional(),
          storageType: Joi.string().optional(),
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
    dateEstimatedHarvest: Joi.date().optional(),
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
        Joi.object()
          .keys({
            name: Joi.string().required(),
            unit: Joi.string().required(),
            quantity: Joi.number().required(),
            typeId: Joi.string().required(),
            supply: Joi.string().required(),
            icon: Joi.string().optional(),
            total: Joi.number().required()
          })
          .unknown()
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
          unitType: Joi.string().optional(),
          tonsHarvest: Joi.number().optional(),
          storageType: Joi.string().optional(),
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
        Joi.object()
          .keys({
            name: Joi.string().required(),
            unit: Joi.string().required(),
            quantity: Joi.number().required(),
            supply: Joi.string().required(),
            typeId: Joi.string().optional(),
            icon: Joi.string().optional(),
            total: Joi.number().required()
          })
          .unknown()
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

export const validateResponseSatelliteImages = async (
  payload: Array<ResponseOkProps>
) => {
  const schema = Joi.array().items(
    Joi.object().keys({
      status_ok: Joi.boolean().required(),
      customOptions: Joi.object()
        .keys({
          activityId: Joi.string().required()
        })
        .required(),
      lotId: Joi.string().required(),
      images: Joi.array()
        .items(
          Joi.object().keys({
            nameFile: Joi.string().required(),
            date: Joi.date().required(),
            type: Joi.string().required(),
            tag: Joi.string().required()
          })
        )
        .optional()
    })
  )

  return schema.validateAsync(payload)
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

export const validateNotEqualNameLot = (lotNames) => {
  const listNames = _.flatten(lotNames.map((item) => item.names))

  const existName = listNames.filter(
    (item, index) => listNames.indexOf(item) !== index
  )
  if (existName.length > 0) {
    return {
      error: true,
      message: 'KMZ names lot duplicate',
      code:
        errors.find((error) => error.key === '004')?.code ||
        'NAME_LOT_DUPLICATED'
    }
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

export const validateTypeActivity = (type: TypeActivity) => {
  return Object.values(TypeActivity).includes(type)
}
export const validateExtensionFile = (files) => {
  if (!files) {
    return { error: false }
  }
  const isValidTypes = Object.keys(files).map((key) => {
    if (files[key].length) {
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

export const validateDateCropAndDateHarvest = (
  dateCrop: string,
  dateHarvest: string
) => {
  const currentDate = moment().subtract(1, 'day')
  const startDate = moment(new Date(dateCrop))
  const endDate = moment(new Date(dateHarvest))

  if (endDate.isBefore(startDate)) {
    return {
      error: true,
      message: 'La fecha de cosecha deber ser posterior a la del cultivo',
      code: ErrorResponse.INVALID_DATE_HARVEST
    }
  }

  return { error: false }
}

function validTypes(file) {
  return file.mimetype.match(VALID_FORMATS_DOCUMENTS) !== null
}
