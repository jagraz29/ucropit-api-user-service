import mongoose from 'mongoose'

const { Schema } = mongoose

const LotSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  area: {
    type: Schema.Types.Mixed,
    require: true
  },
  status: {
    type: Boolean,
    require: true
  },
  surface: {
    type: Number,
    require: true
  },
  tag: {
    type: String,
    require: true
  }
})

const Lot = mongoose.model('Lot', LotSchema)

export default Lot
