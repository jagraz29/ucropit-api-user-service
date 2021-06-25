import { Request, Response, NextFunction } from 'express'
import { LicenseTypes, LicenseStatus } from '../../interfaces'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import { joiSchemaClause } from '..'
import * as Joi from 'joi'
import JoiObjectId from "joi-objectid";
const JoiValidation = JoiObjectId(Joi)

export const updateLicenseValidation = (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  const schema = Joi.object({
    id: JoiValidation.objectId().optional(),
    name: Joi.string().optional(),
    type: Joi.string().optional().valid(...Object.values(LicenseTypes)),
    previewDescription: Joi.string().optional(),
    companyId: Joi.string().optional(),
    cropType: Joi.string().optional(),
    termsAndConditions: Joi.string().optional(),
    clauses: Joi.array().items(JoiValidation.objectId().required()).optional(),
    accessibleIdentifier: Joi.array().items(Joi.string().optional()).optional(),
    startDatePost: JoiValidation.date().optional(),
    endDatePost: JoiValidation.date().optional(),
    startDate: JoiValidation.date().optional(),
    endDate: JoiValidation.date().optional(),
    companyUsers: Joi.array().items(Joi.string().optional()).optional(),
    status: Joi.string().optional().valid(...Object.values(LicenseStatus)),
    hectareLimit: Joi.number().optional(),
    timeLeftPost: Joi.number().optional(),
    timeLeftNew: Joi.number().optional(),
    hectareLeftPercentage: Joi.number().optional(),
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
