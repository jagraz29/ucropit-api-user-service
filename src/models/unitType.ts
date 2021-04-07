/**
 * @swagger
 *  components:
 *    schemas:
 *       UnitType:
 *         type: object
 *         required:
 *           - name
 *           - key
 *         properties:
 *           name:
 *             type: object
 *             properties:
 *                  en:
 *                    type: string
 *                  es:
 *                    type: string
 *           key:
 *             type: string
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
