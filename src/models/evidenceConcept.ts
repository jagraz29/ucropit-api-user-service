/**
 * @swagger
 *  components:
 *    schemas:
 *       EvidenceConcept:
 *         type: object
 *         required:
 *           - code
 *           - name
 *         properties:
 *           code:
 *             type: string
 *           name:
 *             type: string
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const EvidenceConcept = new Schema({
  code: {
    type: String
  },
  name: {
    en: {
      type: String,
      required: true
    },
    es: {
      type: String,
      required: true
    }
  }
})

export default mongoose.model('EvidenceConcept', EvidenceConcept)
