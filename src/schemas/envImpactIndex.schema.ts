/**
 * @swagger
 *  components:
 *    schemas:
 *       envImpactIndex:
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
import { IEntity, TEiqRanges } from '../interfaces'
import { Schema } from 'mongoose'

export const EnvImpactIndexSchema: Schema = new Schema(
  {
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop'
    },
    lot: {
      type: Schema.Types.ObjectId,
      ref: 'Lot'
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    entity: {
      type: String,
      enum: Object.values(IEntity),
      required: true
    },
    eiq: {
      value: {
        type: Number,
        required: true,
        default: 0
      },
      planned: {
        type: Number,
        required: true,
        default: 0
      },
      range: {
        type: String,
        enum: Object.values(TEiqRanges)
      }
    }
  },
  { timestamps: true }
)
