import mongoose, { Schema } from 'mongoose'

const IntegrationLogSchema = new Schema(
  {
    crop: {
      type: Schema.Types.ObjectId,
      ref: 'Crop'
    },
    activity: {
      type: Schema.Types.ObjectId,
      ref: 'Activity'
    },
    achievement: {
      type: Schema.Types.ObjectId,
      ref: 'Achievement'
    },
    synchronized: {
      type: Boolean
    },
    message: {
      type: String
    },
    log: {
      type: Schema.Types.Mixed
    },
    date: {
      type: Date,
      default: new Date()
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

IntegrationLogSchema.virtual('dateFormat').get(function () {
  return this.date.toLocaleDateString('es-ES', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

export default mongoose.model('IntegrationLog', IntegrationLogSchema)
