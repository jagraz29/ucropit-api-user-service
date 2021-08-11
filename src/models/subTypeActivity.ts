import { model } from 'mongoose'
import { ISubTypeActivity } from '../interfaces'
import { SubTypeActivitySchema } from '../schemas'

export const SubTypeActivityModel = model<ISubTypeActivity>(
  'EiqRanges',
  SubTypeActivitySchema
)
