import mongoose from 'mongoose'

const { Schema } = mongoose

export const FileDocumentSchema = new Schema({
  nameFile: {
    type: String,
    required: true
  },

  date: {
    type: Date,
    required: true
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
})

export default mongoose.model('FileDocument', FileDocumentSchema)
