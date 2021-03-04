import mongoose, { Schema } from 'mongoose'

const IntegrationLogSchema = new Schema({
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
  log: {
    type: Schema.Types.Mixed
  },
  date: {
    type: Date,
    default: new Date()
  }
})

export default mongoose.model('IntegrationLog', IntegrationLogSchema)
