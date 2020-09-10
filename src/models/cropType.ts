/**
 * @swagger
 *  components:
 *    schemas:
 *       CropType:
 *         type: object
 *         required:
 *           - name
 *           - key
 *         properties:
 *           name:
 *             type: object
 *             properties:
 *                  en:
 *                    type: string
 *                  es:
 *                    type: string
 *           key:
 *             type: string
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

export const CropTypeSchema = new Schema({
  name: {
    en: {
      type: String
    },
    es: {
      type: String
    }
  },
  key: {
    type: String
  }
})

export const CropType = mongoose.model('CropType', CropTypeSchema)
