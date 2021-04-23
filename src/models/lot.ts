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
 *         example:
 *            name: Lote 1
 *            area: []
 *            status: 0
 *            surface: 45.5
 *            tag: Tag Name
 */
import mongoose from 'mongoose'
import _ from 'lodash'
import { getCenterOfBounds } from 'geolib'

const { Schema } = mongoose

export interface Lot extends mongoose.Document {
  _id: string
  name: string
  area: any
  surface: Number
  status: boolean
  satelliteFiles?: Array<any>
}

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
    satelliteFiles: [{ type: Schema.Types.ObjectId, ref: 'SatelliteFile' }]
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

LotSchema.virtual('coordinates').get(function () {
  const coordinates = this.area.map((coordinate) => {
    return {
      latitude: coordinate[1],
      longitude: coordinate[0]
    }
  })

  return coordinates
})

LotSchema.virtual('coordinateForGoogle').get(function () {
  const coordinatesForGoogle = this.area.map((coordinate) => {
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

export default mongoose.model<Lot>('Lot', LotSchema)
