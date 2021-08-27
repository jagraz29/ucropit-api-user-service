import { Activity } from '../activities/Activity.Interface'
import { Company } from '../company/Company.interface'
import { CropType } from '../croptype'
import { UnitType } from '../unitType'

export interface Crop {
  name?: string
  pay?: number
  dateCrop?: Date
  dateHarvest?: Date
  surface?: number
  volume?: number
  cancelled?: boolean
  downloaded?: boolean
  cropType?: CropType
  envImpactIndex?: any
  unitType?: UnitType
  member?: any[]
  lots?: any[]
  pending?: Activity[]
  toMake?: Activity[]
  done?: Activity[]
  finished?: Activity[]
  badges?: any[]
  syncronizedList?: any[]
  company?: Company
  activities?: Activity[]
}
