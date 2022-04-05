import { EmailOrPasswordIncorrect, UserAlreadyExist } from '@error/Errors'
import HttpError from '@error/HttpError'
import auth from '@middlewares/auth'
import User, { UserInterface } from '@models/User'
import { NextFunction, Request, Response, Router } from 'express'
import _ from 'express-async-handler'
import passport from 'passport'
const router = Router()

/**
 *   @desc    Register a new user
 *   @route   POST /api/v__/auth/local/register
 *   @access  Public
 */
async function local_register(req: Request, res: Response, next: NextFunction) {
  const { userName, email, password } = req.body

  const user = await User.findOne({ email })

  if (user) HttpError(UserAlreadyExist)

  const newUser = await User.create({
    userName,
    email,
    password,
    provider: 'local',
  })

  res.status(201).json({ data: newUser.withToken() })
}

/**
 *   @desc    LoginExistingUser
 *   @route   POST /api/v__/auth/local/login
 *   @access  Public
 */
async function local_login(req: Request, res: Response, next: NextFunction) {
  const { email, password } = req.body

  const user = await User.findOne({ email })

  if (user?.matchPasswords(password)) {
    res.json({ data: user.withToken() })
  } else {
    HttpError(EmailOrPasswordIncorrect)
  }
}

router.route('/local/register').post(_(local_register))
router.route('/local/login').post(_(local_login))

// 302 to https://accounts.google.com/o/oauth2/v2/auth
const google = passport.authenticate('google', { scope: ['email', 'profile'] })
// then redirect here +++ this route will grab information from googleapis.com
const googleCallback = [
  passport.authenticate('google', {
    failureRedirect: process.env.GOOGLE_CLIENT_CALLBACK_URL_FRONTEND_FAILURE,
  }),
  function (req: Request, res: Response) {
    const user = req.user as UserInterface
    const toQuery = '?user=' + JSON.stringify(user.withToken())
    res.redirect(
      (process.env.GOOGLE_CLIENT_CALLBACK_URL_FRONTEND as string) + toQuery
    )
  },
]

router.route('/google').get(google)
router.route('/google/callback').get(googleCallback)

export default router
