import { Document } from 'mongoose'

export interface ISubTypeActivity {
  activityType: string
  name: string
}

export type ISubTypeActivityDocument = ISubTypeActivity & Document
