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
    }
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
)

LotSchema.virtual('coordinates').get(function () {
  const coordinates = this.area.map((coordinate) => {
    console.log('Virtual coordinates')
    console.log(coordinate)
    return {
      latitude: coordinate[1],
      longitude: coordinate[0]
    }
  })

  return coordinates
})

LotSchema.virtual('coordinateForGoogle').get(function () {
  const coordinatesForGoogle = this.area.map((coordinate) => {
    console.log('Virtual coordinateForGoogle')
    console.log(coordinate)
    return {
      lat: coordinate[1],
      lng: coordinate[0]
    }
  })

  return coordinatesForGoogle
})

LotSchema.virtual('centerBound').get(function () {
  console.log('centerBound')
  console.log(this.coordinates)
  return getCenterOfBounds(this.coordinates)
})

LotSchema.virtual('centerBoundGoogle').get(function () {
  console.log('centerBoundGoogle')
  console.log(this.coordinates)
  const centerBound = this.centerBound

  return {
    lat: centerBound.latitude,
    lng: centerBound.longitude
  }
})

export default mongoose.model('Lot', LotSchema)
