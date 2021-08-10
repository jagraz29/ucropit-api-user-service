import { model } from 'mongoose'
import { IEiqRanges } from '../interfaces'
import { SubTypeActivitySchema } from '../schemas'

export const SubTypeActivityModel = model<IEiqRanges>(
  'EiqRanges',
  SubTypeActivitySchema
)
