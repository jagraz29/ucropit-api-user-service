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
    en: {
      type: String,
      required: true
    },
    es: {
      type: String,
      required: true
    }
  },
  key: {
    type: String,
    require: true
  }
})

export const UnitType = mongoose.model('UnitType', UnitTypeSchema)
