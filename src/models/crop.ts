import mongoose from 'mongoose'

const { Schema } = mongoose

const CropTypeSchema = new Schema({
  name: {
    type: String,
    require: true
  }
})

const UnitTypeSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  key: {
    type: String,
    require: true
  },
  unit: {
    type: Number,
    require: true
  }
})

const CropSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  status: {
    type: String,
    enum: ['IN_PROGRESS', 'DONE', 'ARCHIVED'],
    default: 'IN_PROGRESS'
  },
  pay: {
    type: Number,
    require: false
  },
  dateCrop: {
    type: Date,
    require: false
  },
  dateHarvest: {
    type: Date,
    require: false
  },
  cropType: {
    type: [CropTypeSchema]
  },
  unitType: {
    type: [UnitTypeSchema]
  },
  company: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  }
})

exports.CropType = mongoose.model('CropType', CropTypeSchema)
exports.UnitType = mongoose.model('UnitType', UnitTypeSchema)
exports.Crop = mongoose.model('Crop', CropSchema)
