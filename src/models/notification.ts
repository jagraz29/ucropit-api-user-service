/**
 * @swagger
 *  components:
 *    schemas:
 *       Input:
 *         type: object
 *         properties:
 *           content:
 *             type: string
 *           title:
 *             type: string
 *           userId:
 *             type: number
 *           data:
 *             type: object
 *           read:
 *             read: boolean
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const Notification = new Schema({
  content: String,
  title: String,
  channel: String,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  data: {
    type: Schema.Types.Mixed,
    require: true
  },
  read: Boolean
})

export default mongoose.model('Notification', Notification)
