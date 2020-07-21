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

const SALT_WORK_FACTOR: number = 10

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
    }
  },
  { timestamps: true }
)

userSchema.pre('save', function (next) {
  const user = this

  if (!user.isModified('pin') || !user.isModified('verifyToken')) {
    return next()
  }

  const fieldChanged: string = user.isModified('pin') ? 'pin' : 'verifyToken'

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
  const fieldToCompare: string = this[field]
  bcrypt.compare(candidatePassword, fieldToCompare, function (
    err,
    isMatch: boolean
  ) {
    if (err) return cb(err)
    cb(null, isMatch)
  })
}

export default mongoose.model('User', userSchema)
