/**
 * @swagger
 *  components:
 *    schemas:
 *       UnitType:
 *         type: object
 *         required:
 *           - name
 *           - key
 *           - unit
 *         properties:
 *           name:
 *             type: string
 *           key:
 *             type: string
 *         example:
 *            name: Kilogramos
 *            key: kg
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

export const UnitTypeSchema = new Schema({
  name: {
    type: String,
    require: true
  },
  key: {
    type: String,
    require: true
  }
})

export const UnitType = mongoose.model('UnitType', UnitTypeSchema)
