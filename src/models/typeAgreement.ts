import mongoose from 'mongoose'

const { Schema } = mongoose

const TypeAgreementSchema = new Schema({
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
  key: {
    type: String,
    required: true
  }
})

export default mongoose.model('TypeAgreement', TypeAgreementSchema)
