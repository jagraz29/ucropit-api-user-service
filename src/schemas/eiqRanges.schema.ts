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
import { TEiqRanges } from '../interfaces'
import { Schema } from 'mongoose'

export const EiqRangesSchema: Schema = new Schema({
  type: {
    type: String,
    enum: Object.values(TEiqRanges),
    required: true,
    unique: true
  },
  range: {
    min: {
      type: Number,
      required: true
    },
    max: {
      type: Number
    }
  }
})