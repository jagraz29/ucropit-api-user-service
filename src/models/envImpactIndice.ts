import { model } from 'mongoose'
import { IEnvImpactIndiceDocument } from '../interfaces'
import { EnvImpactIndiceSchema } from '../schemas'

export const EnvImpactIndiceModel = model<IEnvImpactIndiceDocument>('EnvImpactIndice', EnvImpactIndiceSchema)