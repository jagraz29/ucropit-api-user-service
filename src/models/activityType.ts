/**
 * @swagger
 *  components:
 *    schemas:
 *       ActivityType:
 *         type: object
 *         required:
 *           - name
 *           - tag
 *         properties:
 *           name:
 *             type: object
 *             properties:
 *                  en:
 *                    type: string
 *                  es:
 *                    type: string
 *           tag:
 *             type: string
 */

import mongoose, { Schema, Document } from 'mongoose'
import { IActivityType } from '../interfaces'

export type ActivityTypeDocument = Document & IActivityType

const ActivityTypeSchema = new Schema({
  name: {
    en: {
      type: String,
      required: true
    },
    es: {
      type: String,
      required: true
    }
  },
  tag: {
    type: String,
    required: true
  }
})

export default mongoose.model<ActivityTypeDocument>(
  'ActivityType',
  ActivityTypeSchema
)
