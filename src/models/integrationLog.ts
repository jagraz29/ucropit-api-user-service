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
  logAchievement: [
    {
      applyForTheAgent: {
        type: String
      },
      _id: {
        type: String
      },
      erpAgentAchievementId: {
        type: String
      },
      processed: {
        type: String
      },
      fullyProcessed: {
        type: String
      },
      name: {
        type: String
      },
      ucropitAchievementId: {
        type: String
      },
      __v: {
        type: String
      },
      erpAgentResponse: {
        type: String
      }
    }
  ]
})

export default mongoose.model('IntegrationLog', IntegrationLogSchema)
