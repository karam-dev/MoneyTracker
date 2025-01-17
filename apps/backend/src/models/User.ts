// @ts-nocheck
import mongoose from 'mongoose'
import crypto from 'crypto'
import { v4 as uuidv4 } from 'uuid'
import { generateToken } from '@utils/tokens'
import { Profile } from 'types/schema'
import type { Profile as PG } from 'passport-google-oauth20'

export interface IProfile extends Profile {
  password?: string
  googleInfo?: {
    accessToken: string
    refreshToken: string
    profile: Pick<PG['_json'],
      | 'sub'
      | 'name'
      | 'given_name'
      | 'family_name'
      | 'picture'
      | 'email'
      | 'email_verified'
      | 'locale'>
  }

  matchPasswords: (password: string) => boolean
  doc: () => Profile & { token: string }
}

const UserSchema = new mongoose.Schema<IProfile>(
  {
    displayName: {
      type: String,
      default: function () {
        return 'user-' + uuidv4().split('-')[0]
      },
    },
    email: {
      type: String,
      required: true,
      validate: {
        validator: function (email: string): boolean {
          return /^\S+@\S+\.\S+$/.test(email)
        },
        message: 'not a valid email',
      },
      index: true,
      unique: true,
    },
    // @ts-ignore
    providers: {
      type: Array,
      required: true,
      validate: {
        validator: function (providers: string[]): boolean {
          return !providers.some(
            (provider) => provider !== 'google' && provider !== 'local'
          )
        },
        message: 'either google or local',
      },
    },
    googleInfo: {
      type: mongoose.Schema.Types.Mixed,
    },
    password: {
      type: String,
    },
    picture: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', async function (next) {
  if (this.providers.some((provider: string) => provider === 'local')) {
    if (!this.password) {
      const error = new Error(
        'user validation failed: password is required field'
      )
      error.name = 'ValidationError'
      // @ts-ignore
      error.errors = {
        password: {
          name: 'validatorError',
          message: 'password is required field',
        },
      }
      next(error)
    } else next()
  } else next()
})

/**
 * methods attached to any instance of User, used to generate token, match password
 */
UserSchema.methods.doc = function () {
  delete this._doc.password
  delete this._doc.googleInfo

  return {
    ...this._doc,
    token: generateToken(this._id, this.email),
  }
}

UserSchema.methods.matchPasswords = function (given: string) {
  const salt = process.env.SALT as string
  const hash = crypto.pbkdf2Sync(given, salt, 100, 64, 'sha512').toString('hex')
  return hash === this.password
}

/**
 * hashing of the password before saving to the database
 */
UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) next()
  else {
    const salt = process.env.SALT as string
    this.password = crypto
      .pbkdf2Sync(this.password, salt, 100, 64, 'sha512')
      .toString('hex')
  }
})

UserSchema.pre('updateOne', async function (next) {
  if (!this._update.password) next()
  else {
    const salt = process.env.SALT as string
    this._update.password = crypto
      .pbkdf2Sync(this._update.password, salt, 100, 64, 'sha512')
      .toString('hex')
  }
})

export default mongoose.model('user', UserSchema)