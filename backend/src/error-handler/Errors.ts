import { CustomErrorProps } from '@interfaces/HTTPError'
import { ValidationError as yupError } from 'yup'

export const EmailOrPasswordIncorrect: CustomErrorProps = {
  status: 401,
  name: 'EmailOrPasswordIncorrect',
  message: "the email or the password doen'n match our records",
  details: {},
}

export const UserAlreadyExist: CustomErrorProps = {
  status: 400,
  name: 'UserAlreadyExist',
  message: 'User already exist.',
  details: {},
}

export const ResourceWasNotFound: CustomErrorProps = {
  status: 404,
  name: 'ResourceWasNotFound',
  message: "couldn't find the target",
  details: {},
}

export const UnknownServerError: CustomErrorProps = {
  status: 500,
  name: 'UnknownServerError',
  message: 'Unknown error occurred in the server.',
  details: {},
}

type fromYup = (error: yupError) => CustomErrorProps
export const ValidationError: fromYup = (error: yupError) => ({
  status: 400,
  name: 'ValidationError',
  message: error.errors[0] || 'some fields are not valid',
  details: {
    path: error.path,
  },
})