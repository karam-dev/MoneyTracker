import { requiredFields, throwHttpError } from '@httpErrors'
import {
  EmailOrPasswordIncorrect,
  UserAlreadyExist,
} from '@httpErrors/errTypes'
import User from '@models/User'
import { NextFunction, Request, Response, Router } from 'express'
import _ from 'express-async-handler'
import { auth_local_login, auth_local_register } from 'types/routes/auth_local'
const local = Router()

/**
 *   @desc      Register a new user
 *   @route     POST /api/v__/auth/local/register
 *   @body      auth_local_register
 *   @response  IProfile
 *   @access    Public
 */
async function local_register(req: Request, res: Response, next: NextFunction) {
  const { userName, email, password } = req.body as auth_local_register

  requiredFields({ email, password })

  const userExist = await User.findOne({ email })

  if (userExist) throwHttpError(UserAlreadyExist)

  const newUser = await User.create({
    userName,
    email,
    password: password,
    providers: ['local'],
  })
  res.status(201).json({ data: newUser.withToken() })
}

/**
 *   @desc      Login existing user using email and password
 *   @route     POST /api/v__/auth/local/login
 *   @body      auth_local_login
 *   @response  IProfile
 *   @access    Public
 */
async function local_login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body as auth_local_login

  requiredFields({ email, password })

  const user = await User.findOne({ email })

  if (
    user?.providers.includes('local') &&
    user?.matchPasswords(password || '')
  ) {
    res.json({ data: user.withToken() })
  } else {
    throwHttpError(EmailOrPasswordIncorrect)
  }
}

local.route('/register').post(_(local_register))
local.route('/login').post(_(local_login))

export default local
