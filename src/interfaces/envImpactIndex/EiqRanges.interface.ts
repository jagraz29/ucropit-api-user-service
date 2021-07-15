import { Document, Model } from 'mongoose'
import { TEiqRanges } from '.'

export interface IEiqRanges {
  type: TEiqRanges
  range: {
    min: number
    max: number
  }
}

export interface IEiqRangesDocument extends IEiqRanges, Document {}
export type IEiqRangesModel = Model<IEiqRangesDocument>
