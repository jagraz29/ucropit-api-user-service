/**
 * @swagger
 *  components:
 *    schemas:
 *       Crop:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           name:
 *             type: string
 *           status:
 *             type: string
 *           pay:
 *             type: number
 *             format: double
 *           dateCrop:
 *             type: string
 *             format: date
 *           dateHarvest:
 *             type: string
 *             format: date
 *           surface:
 *             type: number
 *             format: double
 *           volume:
 *             type: number
 *             format: double
 *           lots:
 *             type: array
 *             items:
 *                type: string
 *           badges:
 *             type: array
 *             items:
 *                type: object
 *           cropType:
 *             type: object
 *             schema:
 *                $ref: '#/components/schemas/CropType'
 *           unitType:
 *             type: object
 *             schema:
 *                $ref: '#/components/schemas/UnitType'
 *           company:
 *              schema:
 *                $ref: '#/components/schemas/Company'
 *
 */
import mongoose from 'mongoose'
import mongooseLeanVirtuals from 'mongoose-lean-virtuals'

const { Schema } = mongoose

const CropSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    pay: {
      type: Number,
      require: false
    },
    dateCrop: {
      type: Date,
      require: false
    },
    dateHarvest: {
      type: Date,
      require: false
    },
    surface: {
      type: Number,
      require: true
    },
    volume: {
      type: Number
    },
    cancelled: {
      type: Boolean,
      default: false
    },
    downloaded: {
      type: Boolean,
      default: false
    },
    identifier: {
      type: String
    },
    cropType: {
      type: Schema.Types.ObjectId,
      ref: 'CropType'
    },
    envImpactIndice: {
      type: Schema.Types.ObjectId,
      ref: 'EnvImpactIndice',
    },
    unitType: {
      type: Schema.Types.ObjectId,
      ref: 'UnitType'
    },
    company: {
      type: Schema.Types.ObjectId,
      ref: 'Company'
    },
    members: [
      {
        identifier: String,
        type: {
          type: String,
          default: 'PRODUCER'
        },
        producer: {
          type: Boolean,
          default: true
        },
        user: { type: Schema.Types.ObjectId, ref: 'User' },
        country: { type: Schema.Types.ObjectId, ref: 'Country' }
      }
    ],
    lots: [
      {
        tag: {
          type: String,
          require: true
        },
        data: [
          {
            type: Schema.Types.ObjectId,
            ref: 'Lot'
          }
        ]
      }
    ],
    pending: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    toMake: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    done: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    finished: [{ type: Schema.Types.ObjectId, ref: 'Activity' }],
    badges: [
      {
        typeAgreement: {
          type: Schema.Types.ObjectId,
          ref: 'TypeAgreement',
          require: true
        },
        badge: {
          type: Schema.Types.ObjectId,
          ref: 'Badge',
          require: true
        },
        surfaceTotal: {
          type: Number,
          require: true
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
  },
  {
    toJSON: {
      virtuals: true
    },
    toObject: {
      virtuals: true
    }
  }
)

CropSchema.plugin(mongooseLeanVirtuals)

export default mongoose.model('Crop', CropSchema)
