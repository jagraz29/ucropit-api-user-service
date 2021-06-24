import { Response } from 'express'
import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type TError = {
  code: string
  message: string
  description?: string
  errors?: Error[]
}

interface IErrorResponse {
  parseStatusCode(statusCode: StatusCodes): number

  parseError(code: string, message: string, extend?: object): TError

  internalServer(error: Error, res?: Response): TError | Response
}

class ErrorResponse implements IErrorResponse {
  public static ERROR_SERVER = 'ERROR_SERVER'
  public static NOT_AUTHORIZATION_EXPORT = 'NOT_AUTHORIZATION_EXPORT'
  public static ERROR_KMZ_INVALID_FORMAT = 'ERROR_KMZ_INVALID_FORMAT'
  public static ERROR_FILE_EXTENSION = 'ERROR_FILE_EXTENSION'
  public static NAME_LOT_DUPLICATED = 'NAME_LOT_DUPLICATED'
  public static RESOURCE_NOT_FOUND = 'RESOURCE_NOT_FOUND'
  public static BADGE_TYPE_DUPLICATED = 'BADGE_TYPE_DUPLICATED'
  public static DATA_NOT_FOUND = 'DATA_NOT_FOUND'
  public static REQUIRED_FIELDS = 'REQUIRED_FIELDS'
  public static INVALID_DATE_CROP = 'INVALID_DATE_CROP'
  public static INVALID_DATE_HARVEST = 'INVALID_DATE_HARVEST'
  public static INVALID_ARRAY_FILES = 'INVALID_ARRAY_FILES'
  public static LOTS_NOT_AVAILABLE = 'LOTS_NOT_AVAILABLE'
  public static INVALID_ARRAY_LOTS = 'INVALID_ARRAY_LOTS'
  public static INVALID_DATA_FIELD = 'INVALID_DATA_FIELD'

  parseError(code: string, message: string, extend?: object): TError {
    return {
      code,
      message,
      ...extend
    }
  }

  parseStatusCode(statusCode: StatusCodes): number {
    return /^2/.test(statusCode.toString()) ? 500 : statusCode
  }

  internalServer(error: any, res: Response): TError | Response {
    const payload = {
      code: ErrorResponse.ERROR_SERVER,
      message: ReasonPhrases.INTERNAL_SERVER_ERROR,
      description: error.toString()
    }
    if (res) {
      return res.status(this.parseStatusCode(res.statusCode)).json(payload)
    }

    return payload
  }
}

export const ErrorResponseInstance = new ErrorResponse()
export default ErrorResponse
