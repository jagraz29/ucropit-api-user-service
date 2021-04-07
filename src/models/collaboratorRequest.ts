/**
 * @swagger
 *  components:
 *    schemas:
 *       CollaboratorRequest:
 *         type: object
 *         required:
 *           - key
 *         properties:
 *           company:
 *             type: string
 *           user:
 *             type: string
 *           status:
 *              type: string
 */
import mongoose, { Schema } from 'mongoose'

const CollaboratorRequestSchema: Schema = new Schema({
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  status: {
    type: String,
    enum: ['accepted', 'pending', 'rejected'],
    default: 'pending'
  }
})

export default mongoose.model('CollaboratorRequest', CollaboratorRequestSchema)
