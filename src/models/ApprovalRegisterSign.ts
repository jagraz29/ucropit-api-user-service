/**
 * @swagger
 *  components:
 *    schemas:
 *       Activity:
 *         type: object
 *         required:
 *           - name
 *         properties:
 *           ots:
 *             type: string
 *           hash:
 *             type: string
 *           surface:
 *              type: number
 *           user:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/User'
 *           file:
 *              type: object
 *              schema:
 *                $ref: '#/components/schemas/FileDocument'
 */
import mongoose from 'mongoose'
const { Schema } = mongoose

const ApprovalRegisterSignSchema = new Schema({
  ots: {
    type: String
  },
  hash: {
    type: String
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  filePdf: {
    type: Schema.Types.ObjectId,
    ref: 'FileDocument'
  },
  fileOts: {
    type: Schema.Types.ObjectId,
    ref: 'FileDocument'
  }
})

export default mongoose.model(
  'ApprovalRegisterSign',
  ApprovalRegisterSignSchema
)
