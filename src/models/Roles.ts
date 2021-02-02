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
    type: String,
    require: true
  },
  value: {
    type: String,
    require: true
  },
})

export default mongoose.model('Roles', Roles)