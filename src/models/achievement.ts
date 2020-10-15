/**
 * @swagger
 *  components:
 *    schemas:
 *       Activity:
 *         type: object
 *         required:
 *           - key
 *         properties:
 *           key:
 *             type: string
 *           dateAchievement:
 *             type: string
 *             format: date
 *           surface:
 *              type: number
 *           status:
 *              type: string
 *           signers:
 *              type: array
 *           lots:
 *              type: array
 *           supplies:
 *              type: array
 *           files:
 *              type: array
 */

import mongoose, { Schema } from 'mongoose'
import shortid from 'shortid'

interface SignerDocument extends mongoose.Document {
  userId: Schema.Types.ObjectId
  fullName: String
  email: String
  type: String
  signed: Boolean
}

interface SuppliesDocument extends mongoose.Document {
  name: String
  unit: String
  quantity: Number
  total: Number
}

export interface AchievementDocument extends mongoose.Document {
  key?: string
  dateAchievement?: Date | string
  surface?: Number | string
  lots?: Array<any>
  supplies?: Array<SuppliesDocument>
  files?: Array<any>
  signers?: Array<SignerDocument>
}

const AchievementSchema: Schema = new Schema({
  key: {
    type: String,
    required: false
  },
  dateAchievement: {
    type: Date,
    required: false
  },
  surface: {
    type: Number,
    required: false
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
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }],
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
  ]
})

AchievementSchema.pre<AchievementDocument>('save', async function (next: Function) {
  const achievement = this

  /** Generate unique key */
  if (!achievement.key) {
    achievement.key = shortid.generate()
  }
})

export default mongoose.model<AchievementDocument>('Achievement', AchievementSchema)
