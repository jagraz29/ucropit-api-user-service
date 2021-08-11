export interface ISupplyType {
  _id: string
  name: string
  code: string
  icon: string
  activities: Array<String>
  cropTypes: Array<String>
}

export interface IQuerySupplyType {
  _id?: string
  name?: string
  code?: string
  activities?: string
  cropTypes?: string
}
