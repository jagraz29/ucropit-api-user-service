import mongoose, { Schema, Document } from 'mongoose'
import { IUnitTypeProps } from '../core/unitTypes/interfaces'
export type UnitTypeDocument = Document & IUnitTypeProps
export const UnitTypeSchema = new Schema({
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
    require: true
  }
})

export const UnitType = mongoose.model<UnitTypeDocument>(
  'UnitType',
  UnitTypeSchema
)
