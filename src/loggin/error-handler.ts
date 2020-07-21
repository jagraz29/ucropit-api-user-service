import BaseError from './base-error'

class ErrorHandler {
  public async handleError (err: Error): Promise<void> {
    // handle with some package
    console.log('err', err)
  }

  public isTrustedError (error: Error) {
    if (error instanceof BaseError) {
      return error.isOperational
    }
    return false
  }
}

export const errorHandler = new ErrorHandler()
