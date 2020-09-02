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
  }
})

export default mongoose.model('UserConfig', UserConfigSchema)
