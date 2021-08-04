/**
 * @swagger
 *  components:
 *    schemas:
 *       TypeAgreement:
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
import { IAgreementType } from '../interfaces'

export type TypeAgreementDocument = Document & IAgreementType

const TypeAgreementSchema = new Schema({
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
  },
  visible: [String]
})

export default mongoose.model<TypeAgreementDocument>(
  'TypeAgreement',
  TypeAgreementSchema
)
