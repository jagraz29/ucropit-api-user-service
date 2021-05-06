export interface ActivePrinciples {
  _id: string
  name: { es: string; en?: string; pt?: string }
  eiq: Number | String | any
}

export interface ActivePrinciplesSupply {
  activePrinciple: string
  eiqActivePrinciple: Number
  composition: Number
  eiq: Number
}
