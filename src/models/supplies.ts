/**
 * @swagger
 *  components:
 *    schemas:
 *      Supplies:
 *        type: object
 *        required:
 *          - name
 *          - type
 *        properties:
 *          name:
 *            type: string
 *          type:
 *            type: string
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const SuppliesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

export default mongoose.model('Supplies', SuppliesSchema)
