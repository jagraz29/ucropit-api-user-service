import { Document } from 'mongoose'

export interface ISubTypeActivity {
  activityType: string
  key: string
  codeLabel?: string
}

export type ISubTypeActivityDocument = ISubTypeActivity & Document
