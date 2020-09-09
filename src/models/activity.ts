import mongoose from 'mongoose'

const { Schema } = mongoose

const ActivitySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  dateStart: {
    type: Date,
    required: false
  },
  dateEnd: {
    type: Date,
    required: false
  },
  dateLimitValidation: {
    type: Date,
    required: false
  },
  surface: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['PLANNED', 'PENDING', 'FINISHED'],
    default: 'PLANNED'
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
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
      total: {
        type: Number
      }
    }
  ],
  evidence: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      date: { type: Date, required: true }
    }
  ],
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }]
})

export default mongoose.model('Activity', ActivitySchema)
