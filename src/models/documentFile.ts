/**
 * @swagger
 *  components:
 *    schemas:
 *      FileDocument:
 *        type: object
 *        required:
 *          - nameFile
 *          - date
 *          - path
 *          - user
 *        properties:
 *          nameFile:
 *            type: string
 *          date:
 *            type: string
 *            format: date
 *          path:
 *            type: string
 *          user:
 *            schema:
 *                $ref: '#/components/schemas/User'
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

export const FileDocumentSchema = new Schema({
  nameFile: {
    type: String,
    required: true
  },
  date: {
    type: Date,
    required: true
  },
  path: {
    type: String,
    required: true
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  settings: {
    type: Schema.Types.Mixed
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('FileDocument', FileDocumentSchema)
