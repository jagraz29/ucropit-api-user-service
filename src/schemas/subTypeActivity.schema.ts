/**
 * @swagger
 *  components:
 *    schemas:
 *       envImpactIndex:
 *         type: object
 *         required:
 *           - type
 *           - name
 *           - goalReach
 *           - image
 *         properties:
 *           type:
 *             type: string
 *             required: true
 *           name:
 *             type: string
 *             required: true
 */
import { Schema } from 'mongoose'

export const SubTypeActivitySchema: Schema = new Schema(
  {
    activityType: {
      type: Schema.Types.ObjectId,
      ref: 'ActivityType'
    },
    key: {
      type: String,
      required: true,
      unique: true
    },
    codeLabel: {
      type: String
    }
  },
  { timestamps: true }
)
