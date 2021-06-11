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
  exitsLotsReusableInCollectionLots, lotsReusableNotExistInDB,
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
        code: 'INVALID_DATA_FIELD',
        message: 'El campo data es requerido'
      })
    }

    const dataInJSON = JSON.parse(data)

    const { error } = await validateCropStore(dataInJSON)

    if (error) {

      return res.status(StatusCodes.UNPROCESSABLE_ENTITY).json(ErrorResponseInstance.parseError(ErrorResponse.REQUIRED_FIELDS, 'Uno o/y mas campos son requeridos', {
        description: ReasonPhrases.BAD_REQUEST,
        error
      }))
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
      return res.status(StatusCodes.BAD_REQUEST).json({
        ...validateDatesCropAndHarvest
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
        code: 'INVALID_ARRAY_LOTS',
        message: 'Debe seleccionar al menos un lote'
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
      let query = {
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
        'Algunos lotes reutilizables no estan disponibles'
      )

      if (responseError.error) {
        return res.status(StatusCodes.CONFLICT).json({
          ...responseError
        })
      }

      const existLots = await CropRepository.findCrops(
        exitsLotsReusableInCollectionLots(identifier, reusableLots)
      )
      const message = 'Algunos lotes no san validos o no existen'
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

    if (data.lots && !req.files) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        error: true,
        code: 'INVALID_ARRAY_FILES',
        message: 'Debe enviar el KMZ asociado a los lotes nuevos'
      })
    }

    const validationKmz = await validateFormatKmz(req.files)

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
