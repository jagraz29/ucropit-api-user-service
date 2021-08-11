/**
 * @swagger
 *  components:
 *    schemas:
 *       roles:
 *         type: object
 *         required:
 *           - label
 *           - value
 *         properties:
 *           label:
 *             type: string
 *           value:
 *             type: string
 */
import mongoose, { Schema, Document } from 'mongoose'
import { IRoles } from '../interfaces'

export type RolesDocument = Document & IRoles

const Roles = new Schema({
  label: {
    en: {
      type: String,
      required: true
    },
    es: {
      type: String,
      required: true
    }
  },
  value: {
    type: String,
    require: true
  },
  isInactive: {
    type: Boolean,
    defaultStatus: false
  }
})

export default mongoose.model<RolesDocument>('roles', Roles)
