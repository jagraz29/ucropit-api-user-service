/**
 * @swagger
 *  components:
 *    schemas:
 *      User:
 *        type: object
 *        required:
 *          - firstName
 *          - lastName
 *          - email
 *          - phone
 *        properties:
 *          firstName:
 *            type: string
 *          lastName:
 *            type: string
 *          phone:
 *           type: string
 *          email:
 *            type: string
 *            format: email
 *            description: Email for the user, needs to be unique.
 *        example:
 *           firstName: jhon
 *           lastName: doe
 *           phone: 342345123
 *           email: fake@email.com
 */
import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

const SALT_WORK_FACTOR: number = 10

const { Schema } = mongoose

export interface UserSchema extends mongoose.Document {
  firstName?: string
  lastName?: string
  phone?: string
  email?: string
  pin?: string
  verifyToken?: string
  companies?: Array<any>
}

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    phone: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    pin: {
      type: String
    },
    verifyToken: {
      type: String
    },
    companies: [{ type: Schema.Types.ObjectId, ref: 'Company' }],
    config: { type: Schema.Types.ObjectId, ref: 'UserConfig' }
  },
  { timestamps: true }
)

userSchema.pre('save', async function (next) {
  const user = this

  if (!user.isModified('pin') && !user.isModified('verifyToken')) {
    return next()
  }
  const fieldChanged: string = user.isModified('pin') ? 'pin' : 'verifyToken'
  console.log('here', fieldChanged)
  if (user[fieldChanged] === null) {
    next()
  }

  bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt: string) {
    if (err) return next(err)

    bcrypt.hash(user[fieldChanged], salt, function (err, hash: string) {
      if (err) return next(err)
      user[fieldChanged] = hash
      next()
    })
  })
})

userSchema.methods.comparePassword = function (
  candidatePassword,
  field: string,
  cb: Function
) {
  if (!this[field]) return cb(null, false)

  const fieldToCompare: string = this[field]
  bcrypt.compare(candidatePassword, fieldToCompare, function (
    err,
    isMatch: boolean
  ) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

userSchema.methods.generateAuthToken = function (): string {
  const payload = { id: this._id }
  const token = jwt.sign(payload, process.env.AUTH_KEY_JWT)

  return token
}

export default mongoose.model<UserSchema>('User', userSchema)
