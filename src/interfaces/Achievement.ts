import { Signer } from './Signer'

interface Supplies {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: Number
  supply?: any
}

interface Destination {
  name?: string
  unit?: string
  quantity?: Number
  typeId?: string
  icon?: string
  total?: Number
}

export interface Achievement {
  _id: string
  key: string
  dateAchievement?: Date
  surface?: Number | number
  percent?: Number
  eiq?: number
  supplies?: Array<Supplies>
  destination?: Array<Destination>
  signers?: Array<Signer>
  synchronizedList?: Array<{ service: string; isSynchronized: Boolean }>
  eiqSurface?: Number | number
}
