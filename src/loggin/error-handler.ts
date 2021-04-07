import BaseError from './base-error'
import mongoose from 'mongoose'
import { ErrorIntegration } from './type'
import { codeIntegrations } from './error-code'

class ErrorHandler {
  public async handleError(err: Error): Promise<void> {
    // handle with some package
    // console.log('err', err)
  }

  public isCastErrorMongoose(error: Error) {
    if (error instanceof mongoose.CastError) {
      // Handle this error
      return true
    }

    return false
  }

  public isTrustedError(error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }

  public isErrorIntegration(error: ErrorIntegration) {
    if (error.response && codeIntegrations.includes(error.response.data.code)) {
      return true
    }
    return false
  }

  public getCodeErrorIntegration(error: ErrorIntegration) {
    return codeIntegrations.find((code) => code === error.response.data.code)
  }
}

export const errorHandler = new ErrorHandler()
