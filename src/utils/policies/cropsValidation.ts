import { Request, Response, NextFunction } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'
import ErrorResponse, { ErrorResponseInstance } from '../ErrorResponse'
import { map, flatten } from 'lodash'
import {
  validateCropStore,
  validateDateCropAndDateHarvest,
  validateFormatKmz,
  validateNotEqualNameLot
} from '../../utils/Validation'
import { CropRepository } from '../../repositories'
import {
  exitsLotsReusableInCollectionLots,
  lotsReusableNotExistInDB,
  responseReusableLotsMessageError,
  validateLotsReusable
} from '../../utils/lots'

export const cropStorePolicy = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body
    if (!data) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        code: ErrorResponse.INVALID_DATA_FIELD,
        message: req.__('crops.errors.invalid_field_data')
      })
    }

    const dataInJSON = JSON.parse(data)

    const { error } = await validateCropStore(dataInJSON)

    if (error) {
      return res.status(StatusCodes.BAD_REQUEST).json(
        ErrorResponseInstance.parseError(
          ErrorResponse.REQUIRED_FIELDS,
          req.__('crops.errors.invalid_fields'),
          {
            description: ReasonPhrases.BAD_REQUEST,
            error
          }
        )
      )
    }

    req.body.data = {
      ...dataInJSON
    }

    return next()
  } catch (err) {
    return ErrorResponseInstance.internalServer(err.toString(), res)
  }
}

export const validateDateCropAndDateHarvestInData = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body

    const validateDatesCropAndHarvest = validateDateCropAndDateHarvest(
      data.dateCrop,
      data.dateHarvest
    )

    if (validateDatesCropAndHarvest.error) {
      const message = res.__(validateDatesCropAndHarvest.localKey)
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...validateDatesCropAndHarvest,
        message
      })
    }

    return next()
  } catch (err) {
    return ErrorResponseInstance.internalServer(err.toString(), res)
  }
}

export const hasLotsInDataPolicy = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body
    let validationDuplicateName = { error: false }

    if (!data.lots && !data.reusableLots) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        code: ErrorResponse.INVALID_ARRAY_LOTS,
        message: req.__('crops.errors.invalid_array_lots')
      })
    }

    if (data.lots) {
      validationDuplicateName = validateNotEqualNameLot(data.lots)
    }

    if (validationDuplicateName.error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...validationDuplicateName
      })
    }
    return next()
  } catch (err) {
    return ErrorResponseInstance.internalServer(err.toString(), res)
  }
}

export const hasLotsReusableInDataPolicy = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body
    const { identifier, dateCrop } = data

    if (data.reusableLots) {
      let responseError
      const reusableLots: string[] = flatten(map(data.reusableLots, 'lotIds'))
      const query = {
        identifier,
        dateHarvest: { $gt: new Date(dateCrop.toString()) },
        $where: function () {
          return this.lots.length > 0
        }
      }

      const cropsList = await CropRepository.findCropsSample(query)
      const lotsNotAvailable = validateLotsReusable(reusableLots, cropsList)
      responseError = responseReusableLotsMessageError(
        lotsNotAvailable,
        req.__('crops.errors.lots_not_available')
      )

      if (responseError.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ...responseError
        })
      }

      const existLots = await CropRepository.findCrops(
        exitsLotsReusableInCollectionLots(identifier, reusableLots)
      )
      const message = req.__('crops.errors.lots_not_exist')
      if (existLots) {
        const notExistLots = lotsReusableNotExistInDB(existLots, reusableLots)
        responseError = responseReusableLotsMessageError(notExistLots, message)
      } else {
        responseError = responseReusableLotsMessageError(reusableLots, message)
      }

      if (responseError.error) {
        return res.status(StatusCodes.BAD_REQUEST).json({
          ...responseError
        })
      }
    }
    return next()
  } catch (err) {
    return ErrorResponseInstance.internalServer(err.toString(), res)
  }
}

export const hasKmzInFilesPolicy = async (
  req: Request | any,
  res: Response,
  next: NextFunction
) => {
  try {
    const { data } = req.body
    let validationKmz = { error: false }

    if (data.lots && !req.files) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        code: ErrorResponse.INVALID_ARRAY_FILES,
        message: req.__('crops.errors.invalid_array_files')
      })
    }

    if (req.files) {
      validationKmz = await validateFormatKmz(req.files)
    }

    if (validationKmz.error) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...validationKmz
      })
    }

    return next()
  } catch (err) {
    return ErrorResponseInstance.internalServer(err.toString(), res)
  }
}
