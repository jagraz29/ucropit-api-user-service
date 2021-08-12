import { Document } from 'mongoose'

export interface ISubTypeActivity {
  activityType: string
  key: string
}

export type ISubTypeActivityDocument = ISubTypeActivity & Document
