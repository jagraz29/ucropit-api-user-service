import mongoose from 'mongoose'

const { Schema } = mongoose

const ActivityTypeSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  tag: {
    type: String,
    required: true
  }
})

export default mongoose.model('ActivityType', ActivityTypeSchema)
