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
import mongoose, { Schema, Document } from 'mongoose'
import { ICropTypeProps } from '../cropTypes/interfaces'

export type CropTypeDocument = Document & ICropTypeProps

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

export const CropType = mongoose.model<CropTypeDocument>(
  'CropType',
  CropTypeSchema
)
