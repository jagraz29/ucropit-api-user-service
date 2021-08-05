export interface Company {
  indentifier: string
  typePerson: 'PHYSICAL_PERSON' | 'LEGAL_PERSON'
  name: string
  address: string
  addressFloor: string
  status: boolean
  files: any
  servicesIntegrations: any
  contacts: any[]
  country: any
}
