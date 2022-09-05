import {
  UnknownServerError,
  ResourceWasNotFound,
  ValidationError,
  BadJsonPayload,
} from '@httpErrors/errTypes'
import { httpError } from '.'
import type { HttpError } from '@httpErrors'
import { NextFunction, Request, Response } from 'express'

export function e400_JsonError(
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (
    err.name === 'SyntaxError' &&
    err.message.startsWith('Unexpected string in JSON at position')
  ) {
    throw httpError(BadJsonPayload)
  } else {
    next(err)
  }
}

export function e404_ResourceNotFound() {
  throw httpError(ResourceWasNotFound)
}

interface mongoosePathValidationError extends Error {
  properties: any
  kind: string
  path: string
  value: any
  reason: any
}

interface mongooseValidationError extends Error {
  errors: {
    [key: string]: mongoosePathValidationError
  }
  _message: string
}

export interface myValidationError extends Error {
  errors: {
    [key: string]: string
  }
}

export function e400_MongooseValidation(
  err: mongooseValidationError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (err.name === 'ValidationError' && err.errors) {
    const validationError = new Error(err._message) as myValidationError

    validationError.errors = Object.keys(err.errors).reduce(
      (acc: { [key: string]: string }, key) => {
        acc[key] = err.errors[key].message
        return acc
      },
      {}
    )

    throw httpError(ValidationError(validationError))
  } else {
    next(err)
  }
}

export function e500_ServerError(
  err: HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(err)
  res.status(UnknownServerError.status).json({
    status: UnknownServerError.status,
    message: UnknownServerError.message,
    name: UnknownServerError.name,
    details: {},
  })
}