import { Document, Model } from 'mongoose'
import { IEntity, TEiqRanges } from '.'

export interface IEnvImpactIndex {
  crop: String
  lot?: String
  activity: String
  achievement: String
  entity: IEntity
  eiq: {
    value: Number
    planned?: Number
    range: TEiqRanges
  }
}

export interface IEnvImpactIndexDocument extends IEnvImpactIndex, Document {}
export interface IEnvImpactIndexModel extends Model<IEnvImpactIndexDocument> {}
