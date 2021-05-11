import mongoose, { Schema, Document } from 'mongoose'
import { ActiveIngredient } from '../interfaces/supplies'

const ActivePrincipleSchema: Schema = new Schema({
  name: {
    en: {
      type: String,
      required: false
    },
    es: {
      type: String,
      required: true
    },
    pt: {
      type: String,
      required: false
    }
  },
  eiq: {
    type: Number,
    required: true
  }
})

export default mongoose.model<ActiveIngredient>(
  'ActiveIngredient',
  ActivePrincipleSchema
)
