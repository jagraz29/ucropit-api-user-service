import { BadgeTypes } from './BadgeTypes.enum'

export interface IBadge {
  _id: string
  type: BadgeTypes
  name: {
    es: string
    en: string
    pt: string
  }
  goalReach: number
  image: string
}
