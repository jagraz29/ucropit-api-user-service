import { Signer } from './Signer'
import { Document, Model } from 'mongoose'

export interface ISupplies {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: number
  supply?: any
}

export interface IDestination {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: number
}

export interface IAchievement {
  // _id: string
  key: string
  dateAchievement?: Date
  surface?: Number | number
  percent?: Number
  eiq?: number
  supplies?: Array<ISupplies>
  destination?: Array<IDestination>
  signers?: Array<Signer>
  synchronizedList?: Array<{ service: string; isSynchronized: Boolean }>
  eiqSurface?: Number | number
}

// export interface IAchievementDocument extends IAchievement, Document {}
// export interface IAchievementModel extends Model<IAchievementDocument> {}
export type IAchievementDocument = IAchievement & Document
