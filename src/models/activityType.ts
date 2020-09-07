import mongoose from 'mongoose'

const { Schema } = mongoose

const ActivityTypeSchema = new Schema({
  name: {
    en: {
      type: String,
      required: true
    },
    es: {
      type: String,
      required: true
    }
  },
  tag: {
    type: String,
    required: true
  }
})

export default mongoose.model('ActivityType', ActivityTypeSchema)
