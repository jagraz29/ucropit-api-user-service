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
  compositon: String,
  activesPrinciples: [
    {
      activePrinciple: {
        type: Schema.Types.ObjectId,
        ref: 'ActivePrinciple'
      },
      eiqActivePrinciple: {
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
SupplySchema.index({ name: 'text', brand: 'text', company: 'text' })

SupplySchema.virtual('eiqTotal').get(function () {
  if (this.activesPrinciples) {
    return this.activesPrinciples.reduce(
      (prev, next) => prev + (next['eiq'] || 0),
      0
    )
  }
  return 0
})

export default mongoose.model('Supply', SupplySchema)
