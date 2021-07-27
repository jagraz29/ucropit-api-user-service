/**
 * @swagger
 *  components:
 *    schemas:
 *       Supply:
 *         type: object
 *         properties:
 *           name:
 *             type: string
 *           company:
 *             type: string
 *           code:
 *             type: string
 *           typeId:
 *             type: string
 *             format: uuid
 *           unit:
 *            type: string
 *           brand:
 *            type: string
 *           compositon:
 *            type: string
 *           eiqTotal:
 *              type: number
 *              format: double
 *           activeIngredients:
 *            type: array
 *            items:
 *              type: object
 *              properties:
 *                _id:
 *                  type: string
 *                  format: uuid
 *                activeIngredient:
 *                  type: string
 *                  format: uuid
 *                eiqActiveIngredient:
 *                  type: number
 *                  format: integer
 *                compositon:
 *                  type: number
 *                  format: double
 *                eiq:
 *                  type: number
 *                  format: double
 *
 */
import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

const { Schema } = mongoose

const SupplySchema = new Schema({
  alphaCode: {
    type: String,
    default: 'AR',
    index: true,
    require: true
  },
  typeId: {
    type: Schema.Types.ObjectId,
    ref: 'SupplyType',
    index: true,
    require: true
  },
  name: String,
  company: String,
  code: String,
  countryId: {
    type: Schema.Types.ObjectId,
    ref: 'Country'
  },
  unit: String,
  brand: String,
  compositon: String,
  activeIngredients: [
    {
      activeIngredient: {
        type: Schema.Types.ObjectId,
        ref: 'ActiveIngredient'
      },
      eiqActiveIngredient: {
        type: Number
      },
      eiq: {
        type: Number
      },
      composition: {
        type: Number
      }
    }
  ]
})
SupplySchema.index({ alphaCode: 1 }, { background: true })
SupplySchema.index({ supplyType: 1 }, { background: true })
SupplySchema.index({ name: 'text', brand: 'text', company: 'text' })

SupplySchema.virtual('eiqTotal').get(function () {
  if (this.activeIngredients) {
    return this.activeIngredients.reduce(
      (prev, next) => prev + (next['eiq'] || 0),
      0
    )
  }
  return 0
})

SupplySchema.plugin(mongooseLeanVirtuals)

export default mongoose.model('Supply', SupplySchema)
