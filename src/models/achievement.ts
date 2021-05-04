/**
 * @swagger
 *  components:
 *    schemas:
 *       Achievement:
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

import mongoose, { Schema, Document } from 'mongoose'
import shortid from 'shortid'
import { Signer } from '../interfaces/Signer'

interface Supplies {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: Number
}

interface Destination {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: Number
}

export interface Achievement {
  _id: string
  key: string
  dateAchievement?: Date
  surface?: Number
  percent?: Number
  supplies?: Array<Supplies>
  destination?: Array<Destination>
  signers?: Array<Signer>
  synchronizedList: Array<{ service: string; isSynchronized: Boolean }>
}

const AchievementSchema: Schema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: false },
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
  percent: {
    type: Number,
    default: 0
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
      typeId: {
        type: Schema.Types.ObjectId,
        ref: 'SupplyType'
      },
      supplie: {
        type: Schema.Types.ObjectId,
        ref: 'Supply'
      },
      icon: {
        type: String
      },
      total: {
        type: Number
      }
    }
  ],
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }],
  destination: [
    {
      unitType: {
        type: Schema.Types.ObjectId
      },
      tonsHarvest: {
        type: Number
      },
      destinationAddress: {
        type: String
      },
      label: {
        type: String
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
      },
      dateSigned: {
        type: Date
      }
    }
  ],
  synchronizedList: [
    {
      service: {
        type: String
      },
      isSynchronized: {
        type: Boolean,
        default: false
      }
    }
  ]
})

AchievementSchema.pre('save', async function (next: Function) {
  const achievement = this

  /** Generate unique key */
  if (!achievement.key) {
    achievement.key = shortid.generate()
  }
})

export default mongoose.model<Achievement>('Achievement', AchievementSchema)
