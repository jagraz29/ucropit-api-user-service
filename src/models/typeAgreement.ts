/**
 * @swagger
 *  components:
 *    schemas:
 *       TypeAgreement:
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

const TypeAgreementSchema = new Schema({
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
    required: true
  },
  visible: [String]
})

export default mongoose.model('TypeAgreement', TypeAgreementSchema)
