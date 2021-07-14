/**
 * @swagger
 *  components:
 *    schemas:
 *       Badge:
 *         type: object
 *         required:
 *           - type
 *           - name
 *           - goalReach
 *           - image
 *         properties:
 *           type:
 *             type: string
 *             required: true
 *           name:
 *             type: object
 *             properties:
 *                  en:
 *                    type: string
 *                    required: true
 *                  es:
 *                    type: string
 *                    required: true
 *                  pt:
 *                    type: string
 *                    required: true
 *           goalReach:
 *             type: number
 *             required: true
 *           image:
 *             type: string
 *             required: true
 */

import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { IBadge, BadgeTypes } from '../interfaces'

const { Schema } = mongoose

const BadgeSchema = new Schema(
  {
    type: {
      type: String,
      enum: Object.values(BadgeTypes),
      required: true,
      unique: true
    },
    name: {
      en: {
        type: String,
        required: true
      },
      es: {
        type: String,
        required: true
      },
      pt: {
        type: String,
        required: true
      }
    },
    goalReach: {
      type: Number,
      required: true
    },
    image: {
      type: String,
      required: true
    }
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)

BadgeSchema.virtual('imagePath').get(function () {
  return `${
    process.env.BASE_URL
  }${process.env.DIR_FOLDER_BADGES.replace('public', '')}/${this.image}`
})

BadgeSchema.plugin(mongooseLeanVirtuals)

export default mongoose.model<IBadge>('Badge', BadgeSchema)
