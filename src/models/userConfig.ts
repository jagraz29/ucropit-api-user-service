import mongoose from 'mongoose'

const { Schema } = mongoose

export const UserConfigSchema = new Schema({
  fromInvitation: {
    type: Boolean,
    default: false
  },
  hasPin: {
    type: Boolean,
    default: false
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('UserConfig', UserConfigSchema)
