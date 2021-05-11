import mongoose, { Schema } from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { hashPassword } from '../utils/auth'

const SALT_WORK_FACTOR: number = 10

const ForeignCredentialSchema = new Schema({
  credentialKey: {
    type: String,
    required: true
  },
  credentialSecret: {
    type: String,
    required: false
  }
})

ForeignCredentialSchema.pre('save', async function (next) {
  const credential = this

  if (!credential.isModified('credentialSecret')) {
    return next()
  }

  if (credential['credentialSecret'] === null) {
    next()
  }

  try {
    credential['credentialSecret'] = await hashPassword(
      credential['credentialSecret'],
      SALT_WORK_FACTOR
    )
    return next()
  } catch (error) {
    return next(error)
  }
})

ForeignCredentialSchema.methods.comparePassword = function (
  candidatePassword,
  field: string,
  cb: Function
) {
  if (!this[field]) return cb(null, false)

  const fieldToCompare: string = this[field]
  bcrypt.compare(
    candidatePassword,
    fieldToCompare,
    function (err, isMatch: boolean) {
      if (err) return cb(err)
      cb(null, isMatch)
    }
  )
}

ForeignCredentialSchema.methods.generateAuthToken = function (): string {
  const payload = { id: this._id }
  const token = jwt.sign(payload, process.env.AUTH_KEY_FOREIGN_JWT)

  return token
}

export default mongoose.model('ForeignCredential', ForeignCredentialSchema)
