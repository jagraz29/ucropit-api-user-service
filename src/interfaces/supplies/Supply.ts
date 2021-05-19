export interface Supply {
  _id: string
  name: string
  company: string
  code: string
  typeId: string
  unit?: string
  brand?: string
  compositon?: string
  quantity?: Number
  activesPrinciples?: Array<any>
  supply?: string | any
  icon?: string
  total?: Number | number
  eiqTotal?: Number | number
}
