/**
 * @swagger
 *  components:
 *    schemas:
 *       Activity:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *           dateStart:
 *             type: string
 *             format: date
 *           dateEnd:
 *             type: string
 *             format: date
 *           dateLimitValidation:
 *             type: string
 *             format: date
 *           surface:
 *              type: number
 *           status:
 *              type: string
 *           collaborators:
 *              type: array
 *           type:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/ActivityType'
 *           typeAgreement:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/TypeAgreement'
 *           crop:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/Crop'
 *           lots:
 *              type: array
 *           supplies:
 *              type: array
 *           evidence:
 *              type: array
 *           files:
 *              type: array
 */
import mongoose from 'mongoose'
import shortid from 'shortid'

const { Schema } = mongoose

const ActivitySchema = new Schema({
  key: {
    type: String,
    required: false
  },
  name: {
    type: String,
    required: true
  },
  dateStart: {
    type: Date,
    required: false
  },
  dateEnd: {
    type: Date,
    required: false
  },
  dateLimitValidation: {
    type: Date,
    required: false
  },
  surface: {
    type: Number,
    required: false
  },
  status: {
    type: String,
    enum: ['PLANNED', 'PENDING', 'FINISHED'],
    default: 'PLANNED'
  },
  collaborators: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User'
    }
  ],
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  typeAgreement: {
    type: Schema.Types.ObjectId,
    ref: 'TypeAgreement'
  },
  crop: {
    type: Schema.Types.ObjectId,
    ref: 'Crop'
  },
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
  supplies: [
    {
      name: {
        type: String
      },
      unit: {
        type: String
      },
      quantity: {
        type: Number
      },
      total: {
        type: Number
      }
    }
  ],
  evidence: [
    {
      name: { type: String, required: true },
      description: { type: String, required: true },
      date: { type: Date, required: true }
    }
  ],
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }]
})

ActivitySchema.pre('save', async function (next) {
  const activity = this

  activity.key = shortid.generate()
})

export default mongoose.model('Activity', ActivitySchema)
