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
    require: true,
    default: 1
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

export default mongoose.model('Lot', LotSchema)
