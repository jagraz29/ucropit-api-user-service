import { Document, Model } from 'mongoose'
export * from './Entity.enum'
import { IEntity, IEiqProps } from '.'

export interface IEnvImpactIndex {
  readonly crop: String
  readonly lot?: String
  readonly activity: String
  readonly achievement?: String
  entity: IEntity
  eiq: Partial<IEiqProps>
}

export type TEiqCreateAchievement = Omit<IEiqProps, 'planned'>
export type TEiqCreateAActivity = Required<Pick<IEiqProps, 'planned'>>

export interface IEnvImpactIndexOfAchievement
  extends Pick<
    IEnvImpactIndex,
    'crop' | 'activity' | 'achievement' | 'lot' | 'entity'
  > {
  eiq: TEiqCreateAchievement
}

export interface IEnvImpactIndexOfActivity
  extends Pick<IEnvImpactIndex, 'crop' | 'activity' | 'lot' | 'entity'> {
  eiq: TEiqCreateAActivity
}

export type TEntryEnvImpactIndex = Pick<
  IEnvImpactIndex,
  'crop' | 'activity' | 'achievement'
>

export interface IEnvImpactIndexDocument extends IEnvImpactIndex, Document {}
export interface IEnvImpactIndexModel extends Model<IEnvImpactIndexDocument> {}
