/**
 * @swagger
 *  components:
 *    schemas:
 *       Lot:
 *         type: object
 *         required:
 *           - name
 *           - area
 *           - status
 *           - surface
 *           - tag
 *         properties:
 *           name:
 *             type: string
 *           area:
 *             type: array
 *           status:
 *             type: boolean
 *           surface:
 *             type: double
 *           tag:
 *             type: string
 *           image:
 *             type: schema
 *           countryName:
 *             type: string
 *           provinceName:
 *             type: string
 *           cityName:
 *             type: string
 *         example:
 *            name: Lote 1
 *            area: []
 *            status: 0
 *            surface: 45.5
 *            tag: Tag Name
 *            image: { normal : '' }
 *            countryName: Argentina
 *            provinceName: Buenos Aires
 *            cityName: 9 de Julio
 */
import mongoose from 'mongoose'
import _ from 'lodash'
import { getCenterOfBounds } from 'geolib'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import { parseImageUrl, parseImageUrlDefault } from '../utils/ParseImageUrl'

const { Schema } = mongoose

export interface Lot extends mongoose.Document {
  _id: string
  name: string
  area: any
  surface: Number
  status: boolean
}

const file = new mongoose.Schema({
  normal: {
    type: String
  }
})

const LotSchema = new Schema(
  {
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
      require: true,
      default: 1
    },
    surface: {
      type: Number,
      require: true
    },
    image: {
      type: file,
      default: null
    },
    countryName: {
      type: String,
      default: null
    },
    provinceName: {
      type: String,
      default: null
    },
    cityName: {
      type: String,
      default: null
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

LotSchema.virtual('coordinates').get(function () {
  const area = this.area ? this.area : []
  const coordinates = area.map((coordinate) => {
    return {
      latitude: coordinate[1],
      longitude: coordinate[0]
    }
  })

  return coordinates
})

LotSchema.virtual('coordinateForGoogle').get(function () {
  const area = this.area ? this.area : []
  const coordinatesForGoogle = area.map((coordinate) => {
    return {
      lat: coordinate[1],
      lng: coordinate[0]
    }
  })
  return coordinatesForGoogle
})

LotSchema.virtual('centerBound').get(function () {
  if (this.coordinates.length === 0) return 0
  return getCenterOfBounds(this.coordinates)
})

LotSchema.virtual('centerBoundGoogle').get(function () {
  const centerBound = this.centerBound

  if (centerBound === 0) return {}

  return {
    lat: centerBound.latitude,
    lng: centerBound.longitude
  }
})
LotSchema.virtual('imageUrl').get(function () {
  return this.image ? parseImageUrl(this.image.normal) : parseImageUrlDefault('lot_placeholder.png')
})

LotSchema.plugin(mongooseLeanVirtuals)
export default mongoose.model<Lot>('Lot', LotSchema)
