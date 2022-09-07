import { Request, Response, NextFunction } from 'express'
import { DomainError } from '../errors'

export const errorHandlerMiddleware = (
  error: Error,
  request: Request,
  response: Response,
  _: NextFunction,
): Response => {
  if (error instanceof DomainError) {
    return response.status(400).json({
      message: error.message,
      error_code: error.name,
    })
  }
  return response.status(500).json({
    message: 'Internal server error',
    errorCode: 'INTERNAL_SERVER_ERROR',
  })
}
