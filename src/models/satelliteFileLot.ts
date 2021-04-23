import mongoose from 'mongoose'
const { Schema } = mongoose

export interface SatelliteFile extends mongoose.Document {
  status: string
  date: Date
  typeImage: string
  file?: any
}

const SatelliteFileSchema = new Schema({
  status: {
    type: String
  },
  date: {
    type: Date
  },
  typeImage: {
    type: String
  },
  file: { type: Schema.Types.ObjectId, ref: 'FileDocument' }
})

export default mongoose.model<SatelliteFile>(
  'SatelliteFile',
  SatelliteFileSchema
)
