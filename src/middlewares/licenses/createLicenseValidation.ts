import { Request, Response, NextFunction } from 'express'
import { LicenseTypes, LicenseStatus } from '../../interfaces'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { joiSchemaClause } from '..'
import * as Joi from 'joi'
import JoiDate from '@hapi/joi-date'
import JoiObjectId from "joi-objectid";

const JoiValidationDate = Joi.extend(JoiDate)
const JoiValidationId = JoiObjectId(Joi)

export const createLicenseValidate = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    type: Joi.string().required().valid(...Object.values(LicenseTypes)),
    previewDescription: Joi.string().required(),
    companyId: JoiValidationId.objectId().required(),
    cropType: Joi.string().required(),
    termsAndConditions: Joi.string().required(),
    clauses: Joi.array().items(JoiValidationId.objectId().required()).required(),
    accessibleIdentifier: Joi.array().items(Joi.string().required()).required(),
    startDatePost: JoiValidationDate.date().required(),
    endDatePost: JoiValidationDate.date().required(),
    startDate: JoiValidationDate.date().required(),
    endDate: JoiValidationDate.date().required(),
    companyUsers: Joi.array().items(JoiValidationId.objectId().required()).required(),
    status: Joi.string().optional().valid(...Object.values(LicenseStatus)),
    hectareLimit: Joi.number().required(),
    timeLeftPost: Joi.number().required(),
    timeLeftNew: Joi.number().required(),
    hectareLeftPercentage: Joi.number().required(),
    image: Joi.string().optional()
  })

  const { error } = schema.validate({ ...req.params, ...req.body })

  if (error) {
    return res.status(StatusCodes.BAD_REQUEST).json({
      error: ReasonPhrases.BAD_REQUEST,
      description: error
    })
  }

  return next()
}
