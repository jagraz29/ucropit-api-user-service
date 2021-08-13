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
 *           lotsWithSurface:
 *              type: object
 *              properties:
 *                lot:
 *                  type: object
 *                  schema:
 *                    $ref: '#/components/schemas/Lot'
 *                surfacePlanned:
 *                  type: number
 *                tag:
 *                  type: string
 *           supplies:
 *              type: array
 *           evidence:
 *              type: array
 *           files:
 *              type: array
 */
import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'
import shortid from 'shortid'

const { Schema } = mongoose

const ActivitySchema = new Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, required: false },
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
  dateHarvest: {
    type: Date
  },
  dateLimitValidation: {
    type: Date,
    required: false
  },
  dateObservation: {
    type: Date
  },
  dateEstimatedHarvest: {
    type: Date,
    required: false
  },
  observation: {
    type: String
  },
  unitType: {
    type: Schema.Types.ObjectId,
    ref: 'UnitType'
  },
  envImpactIndex: {
    type: Schema.Types.ObjectId,
    ref: 'EnvImpactIndex'
  },
  subTypeActivity: {
    type: Schema.Types.ObjectId,
    ref: 'SubTypeActivity'
  },
  keySubTypesActivity: {
    type: String,
    required: false
  },
  pay: {
    type: Number
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
      },
      dateSigned: {
        type: Date
      }
    }
  ],
  approvalRegister: {
    type: Schema.Types.ObjectId,
    ref: 'ApprovalRegisterSign'
  },
  type: {
    type: Schema.Types.ObjectId,
    ref: 'ActivityType'
  },
  typeAgreement: {
    type: Schema.Types.ObjectId,
    ref: 'TypeAgreement'
  },
  lots: [{ type: Schema.Types.ObjectId, ref: 'Lot' }],
  lotsWithSurface: [
    {
      lot: { type: Schema.Types.ObjectId, ref: 'Lot' },
      surfacePlanned: {
        type: Number
      },
      tag: {
        type: String
      }
    }
  ],
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
  storages: [
    {
      unitType: {
        type: Schema.Types.ObjectId,
        ref: 'UnitType'
      },
      tonsHarvest: {
        type: Number
      },
      storageType: {
        type: Schema.Types.ObjectId,
        ref: 'TypeStorage'
      },
      label: {
        type: String
      }
    }
  ],
  files: [{ type: Schema.Types.ObjectId, ref: 'FileDocument' }],
  achievements: [{ type: Schema.Types.ObjectId, ref: 'Achievement' }],
  user: { type: Schema.Types.ObjectId, ref: 'User' },
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

ActivitySchema.pre('save', function (next) {
  const activity: any = this
  /** Generate unique key */
  if (!activity.key) {
    activity.key = shortid.generate()
  }
  next()
})

ActivitySchema.methods.isDone = function () {
  const activity: any = this
  return activity.status[0].name.en === 'DONE'
}

ActivitySchema.methods.setExpired = function () {
  const activity: any = this
  activity.status[0].name.en = 'EXPIRED'
  activity.status[0].name.es = 'VENCIDA'
}

ActivitySchema.plugin(mongooseLeanVirtuals)

export default mongoose.model('Activity', ActivitySchema)
