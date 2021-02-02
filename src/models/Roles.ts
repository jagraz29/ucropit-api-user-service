/**
 * @swagger
 *  components:
 *    schemas:
 *       Roles:
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
import mongoose from 'mongoose'

const { Schema } = mongoose

const Roles = new Schema({
  label: {
    en: {
      type: String,
      required: true,
    },
    es: {
      type: String,
      required: true,
    },
  },
  value: {
    type: String,
    require: true
  },
})

export default mongoose.model('roles', Roles)