/**
 * @swagger
 *  components:
 *    schemas:
 *      UserConfig:
 *        type: object
 *        required:
 *          - fromInvitation
 *          - hasPin
 *          - companySelected
 *        properties:
 *          fromInvitation:
 *            type: boolean
 *          hasPin:
 *            type: boolean
 *          companySelected:
 *           type: string
 *        example:
 *           fromInvitation: false
 *           hasPin: false
 *           companySelected: 5f85e57be2a5a01a4585e50c
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

export const UserConfigSchema = new Schema({
  fromInvitation: {
    type: Boolean,
    default: false
  },
  hasPin: {
    type: Boolean,
    default: false
  },
  companySelected: {
    type: Schema.Types.ObjectId,
    ref: 'Company'
  },
  languageSelected: {
    type: String
  }
})

export default mongoose.model('UserConfig', UserConfigSchema)
