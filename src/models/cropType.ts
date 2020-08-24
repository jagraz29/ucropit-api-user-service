/**
 * @swagger
 *  components:
 *    schemas:
 *       CropType:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *         example:
 *            name: Soja
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

export const CropTypeSchema = new Schema({
  name: {
    type: String,
    require: true
  }
})

export const CropType = mongoose.model('CropType', CropTypeSchema)
