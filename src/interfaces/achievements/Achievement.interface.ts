import { Signer } from '../Signer'
import { Document } from 'mongoose'

export interface ISupplies {
  name?: string
  unit?: string
  quantity?: number
  typeId?: string
  icon?: string
  total?: number
  eiqTotal?: number
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

export interface ILots {}

export interface LotsWithSurface {
  tag?: string
  lot?: object
  surfacePlanned?: number
  surfaceAchievement?: number
}

export interface IAchievement {
  // _id: string
  envImpactIndex: string
  key: string
  dateAchievement?: Date
  surface?: number
  percent?: number
  eiq?: number
  supplies?: Array<ISupplies>
  destination?: Array<IDestination>
  signers?: Array<Signer>
  synchronizedList?: Array<{ service: string; isSynchronized: boolean }>
  eiqSurface?: number
  lots?: ILots[]
  lotsWithSurface?: LotsWithSurface[]
}

export type IAchievementDocument = IAchievement & Document
