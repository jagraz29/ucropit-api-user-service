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

const SupplySchema = new Schema({
  name: String,
  company: String,
  code: String,
  typeId: {
    type: Schema.Types.ObjectId,
    ref: 'SupplyType'
  },
  unit: String,
  brand: String,
  compositon: String
})

export default mongoose.model('Supply', SupplySchema)
