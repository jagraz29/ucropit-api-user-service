import { ReasonPhrases, StatusCodes } from 'http-status-codes'

export type TError = {
    code: string
    message: string
    description?: string,
    errors?: Error[]
}

interface IErrorResponse {
    parseStatusCode (statusCode: StatusCodes): number
    // tslint:disable-next-line:unified-signatures
    parseError (code: string, message: string, extend?: object): TError,
    internalServer (error: Error): TError,
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

    parseError (code: string, message: string, extend?: object): TError {
        return {
            code,
            message,
            ...extend
        }
    }

    parseStatusCode (statusCode: StatusCodes): number {
        return /^2/.test(statusCode.toString()) ? 500 : statusCode
    }

    internalServer (error: any): TError {
        return {
            code: ErrorResponse.ERROR_SERVER,
            message: ReasonPhrases.INTERNAL_SERVER_ERROR,
            description: error.toString()
        }
    }
}
export const ErrorResponseInstance = new ErrorResponse()
export default ErrorResponse
