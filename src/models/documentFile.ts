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

export const FileDocumentSchema = new Schema(
  {
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
      required: false
    },
    name: {
      type: String
    },
    pathThumbnails: {
      type: String
    },
    pathIntermediate: {
      type: String
    },
    description: {
      type: String
    },
    isSatelliteImage: {
      type: Boolean
    },
    settings: {
      type: Schema.Types.Mixed
    },
    meta: {
      type: Schema.Types.Mixed
    },
    user: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

FileDocumentSchema.virtual('imagePathIntermediate').get(function () {
  if (this.pathIntermediate) {
    return `${process.env.BASE_URL}/${this.pathIntermediate}`
  }
  return `${process.env.BASE_URL}/${this.path}`
})

FileDocumentSchema.virtual('imagePathThumbnails').get(function () {
  if (this.pathThumbnails) {
    return `${process.env.BASE_URL}/${this.pathThumbnails}`
  }

  return `${process.env.BASE_URL}/${this.path}`
})

FileDocumentSchema.virtual('imageSatellite').get(function () {
  if (this.isSatelliteImage) {
    return `${process.env.BASE_URL_IMAGES}/${this.nameFile}`
  }
  return ''
})

export default mongoose.model('FileDocument', FileDocumentSchema)
