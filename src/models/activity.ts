import mongoose from 'mongoose'

const { Schema } = mongoose

const ActivitySchema = new Schema({
  dateStart: {
    type: Date,
    required: true
  },
  dateEnd: {
    type: Date,
    required: true
  },
  surface: {
    type: Number,
    required: true
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'TypeAgreement'
  },
  crop: {
    type: Schema.Types.ObjectId,
    ref: 'Crop'
  },
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
  supplies: {
    type: Schema.Types.Mixed
  },
  evidence: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }]
})

export default mongoose.model('Activity', ActivitySchema)
