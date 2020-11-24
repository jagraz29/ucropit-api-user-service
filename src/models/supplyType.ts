/**
 * @swagger
 *  components:
 *    schemas:
 *       Input:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           company:
 *             type: string
 *           code:
 *             type: string
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const SupplyTypeSchema = new Schema({
  name: String,
  code: String,
  icon: String
})

export default mongoose.model('SupplyType', SupplyTypeSchema)
