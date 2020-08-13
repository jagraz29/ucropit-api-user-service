import BaseError from './base-error'
import mongoose from 'mongoose'

class ErrorHandler {
  public async handleError (err: Error): Promise<void> {
    // handle with some package
    // console.log('err', err)
  }

  public isCastErrorMongoose (error: Error) {
    if (error instanceof mongoose.CastError) {
      // Handle this error
      return true
    }

    return false
  }

  public isTrustedError (error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}

export const errorHandler = new ErrorHandler()
