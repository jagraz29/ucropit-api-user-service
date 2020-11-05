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
import { isNowGreaterThan } from '../utils/Date'

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
  status: [
    {
      name: {
        en: {
          type: String,
          default: 'TO_COMPLETE'
        },
        es: {
          type: String,
          default: 'COMPLETAR'
        }
      }
    }
  ],
  signers: [
    {
      userId: {
        type: Schema.Types.ObjectId
      },
      fullName: {
        type: String
      },
      email: {
        type: String
      },
      type: {
        type: String
      },
      signed: {
        type: Boolean,
        default: false
      }
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
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
  lotsMade: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
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
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }],
  achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' }
})

ActivitySchema.pre('save', async function (next) {
  const activity = this

  /** Generate unique key */
  if (!activity.key) {
    activity.key = shortid.generate()
  }
})

ActivitySchema.methods.setExpired = function () {
  this.status[0].name.en = 'EXPIRED'
  this.status[0].name.es = 'VENCIDA'
}

export default mongoose.model('Activity', ActivitySchema)
