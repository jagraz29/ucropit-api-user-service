import mongoose from 'mongoose'

const { Schema } = mongoose

const SuppliesSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  }
})

export default mongoose.model('Supplies', SuppliesSchema)
