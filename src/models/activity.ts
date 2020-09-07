import mongoose from 'mongoose'

const { Schema } = mongoose

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
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
    ref: 'ActivityType'
  },
  typeAgreement: {
    type: Schema.Types.ObjectId,
    ref: 'TypeAgreement'
  },
  crop: {
    type: Schema.Types.ObjectId,
    ref: 'Crop'
  },
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
  supplies: [
    {
      name: {
        type: String
      },
      unit: {
        type: String
      },
      quantity: {
        type: Number
      },
      total: Number
    }
  ],
  evidence: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      date: { type: Date, required: true },
      file: { type: Schema.Types.ObjectId, ref: 'FileDocument' }
    }
  ]
})

export default mongoose.model('Activity', ActivitySchema)
