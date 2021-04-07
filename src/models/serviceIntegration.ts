/**
 * @swagger
 *  components:
 *    schemas:
 *       ServiceIntegration:
 *         type: object
 *         required:
 *           - code
 *           - name
 *           - erpAgent
 *         properties:
 *           code:
 *             type: string
 *           name:
 *             type: string
 *           erpAgent:
 *             type: string
 */
import mongoose from 'mongoose'

const { Schema } = mongoose

const ServiceIntegrationSchema = new Schema({
  code: {
    type: String
  },
  name: {
    type: String
  },
  description: {
    type: String
  },
  conditions: [String],
  erpAgent: {
    type: String
  }
})

export default mongoose.model('ServicesIntegrations', ServiceIntegrationSchema)
