import mongoose from 'mongoose'

const { Schema } = mongoose

const TypeAgreementSchema = new Schema({
  name: {
    type: String
  }
})

export default mongoose.model('TypeAgreement', TypeAgreementSchema)
