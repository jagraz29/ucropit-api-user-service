import { Document, Model } from 'mongoose'
import { IEntity, TEiqRanges } from '.'

export interface IEnvImpactIndice {
  crop: String
  lot?: String
  activity: String
  achievement: String
  entity: IEntity
  eiq: {
    value: Number
    planned?: Number
    range:TEiqRanges
  }
}

export interface IEnvImpactIndiceDocument extends IEnvImpactIndice, Document {}
export interface IEnvImpactIndiceModel extends Model<IEnvImpactIndiceDocument> {}
