export interface IServiceIntegration {
  _id?: string
  code: string
  name: string
  description: string
  erpAgent?: string
  conditions: [String]
}
