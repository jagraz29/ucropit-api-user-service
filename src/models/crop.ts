/**
 * @swagger
 *  components:
 *    schemas:
 *       Crop:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *           status:
 *             type: string
 *           pay:
 *             type: number
 *             format: double
 *           dateCrop:
 *             type: string
 *             format: date
 *           dateHarvest:
 *             type: string
 *             format: date
 *           surface:
 *             type: number
 *             format: double
 *           lots:
 *             type: array
 *             items:
 *                type: string
 *           cropType:
 *             type: object
 *             schema:
 *                $ref: '#/components/schemas/CropType'
 *           unitType:
 *             type: object
 *             schema:
 *                $ref: '#/components/schemas/UnitType'
 *           company:
 *              schema:
 *                $ref: '#/components/schemas/Company'
 *
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const CropSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'DONE', 'ARCHIVED'],
    default: 'IN_PROGRESS'
  },
  pay: {
    type: Number,
    require: false
  },
  dateCrop: {
    type: Date,
    require: false
  },
  dateHarvest: {
    type: Date,
    require: false
  },
  surface: {
    type: Number,
    require: true
  },
  owner: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  cropType: {
    type: Schema.Types.ObjectId,
    ref: 'CropType'
  },
  unitType: {
    type: Schema.Types.ObjectId,
    ref: 'UnitType'
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }]
})

export default mongoose.model('Crop', CropSchema)