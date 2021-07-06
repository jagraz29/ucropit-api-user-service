import { model } from 'mongoose'
import { IEnvImpactIndexDocument } from '../interfaces'
import { EnvImpactIndexSchema } from '../schemas'

export const EnvImpactIndexModel = model<IEnvImpactIndexDocument>(
  'EnvImpactIndex',
  EnvImpactIndexSchema
)
