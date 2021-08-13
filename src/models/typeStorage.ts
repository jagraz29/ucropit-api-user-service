/**
 * @swagger
 *  components:
 *    schemas:
 *       TypeStorage:
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
import { ITypeStorageProps } from '../core/typeStorages/interfaces'
export type TypeStorageDocument = Document & ITypeStorageProps
const TypeStorageSchema = new Schema({
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
  key: {
    type: String,
    required: true
  }
})

export default mongoose.model<TypeStorageDocument>(
  'TypeStorage',
  TypeStorageSchema
)
