export interface Company {
  indentifier: string
  typePerson: TypePersonEnum
  name: string
  address: string
  addressFloor: string
  status: boolean
  files: any
  servicesIntegrations: any
  contacts: any[]
  country: any
}

export enum TypePersonEnum {
  PHISICAL_PERSON =  'PHISICAL_PERSON',
  LEGAL_PERSON =  'LEGAL_PERSON'
}
