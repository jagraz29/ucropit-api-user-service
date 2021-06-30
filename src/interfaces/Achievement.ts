import { Signer } from './Signer'
import { Document, Model } from 'mongoose'

export interface ISupplies {
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
  supply?: any
}

export interface IDestination {
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
}

export interface IAchievement {
  // _id: string
  key: string
  dateAchievement?: Date
  surface?: number | number
  percent?: number
  eiq?: number
  supplies?: Array<ISupplies>
  destination?: Array<IDestination>
  signers?: Array<Signer>
  synchronizedList?: Array<{ service: string; isSynchronized: boolean }>
  eiqSurface?: number | number
}

// export interface IAchievementDocument extends IAchievement, Document {}
// export interface IAchievementModel extends Model<IAchievementDocument> {}
export type IAchievementDocument = IAchievement & Document
