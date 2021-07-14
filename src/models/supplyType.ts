/**
 * @swagger
 *  components:
 *    schemas:
 *       SupplyTypes:
 *         type: object
 *         properties:
 *           _id:
 *              type: string
 *              format: uuid
 *           name:
 *             type: string
 *           code:
 *             type: string
 *           icon:
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
