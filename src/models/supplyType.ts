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
import mongoose, { Document } from 'mongoose'
import { ISupplyType } from '../interfaces'

export type SupplyTypeDocument = Document & ISupplyType

const { Schema } = mongoose

const SupplyTypeSchema = new Schema({
  name: String,
  code: String,
  icon: String,
  activities: Array
})

export default mongoose.model<SupplyTypeDocument>(
  'SupplyType',
  SupplyTypeSchema
)
