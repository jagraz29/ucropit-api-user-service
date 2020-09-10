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

import mongoose from 'mongoose'

const { Schema } = mongoose

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

export default mongoose.model('ActivityType', ActivityTypeSchema)
