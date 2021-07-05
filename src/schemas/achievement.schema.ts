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
import { Schema } from 'mongoose'

export const AchievementSchema: Schema = new Schema({
  _id: { type: Schema.Types.ObjectId, required: false },
  envImpactIndice: {
    type: Schema.Types.ObjectId,
    ref: 'EnvImpactIndice',
  },
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
  eiqSurface: {
    type: Number
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
      supply: {
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
