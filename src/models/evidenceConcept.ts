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
import mongoose, { Schema, Document } from 'mongoose'
import { IEvidenceConcept } from '../interfaces'

export type EvidenceConceptDocument = Document & IEvidenceConcept

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

export default mongoose.model<EvidenceConceptDocument>(
  'EvidenceConcept',
  EvidenceConcept
)
