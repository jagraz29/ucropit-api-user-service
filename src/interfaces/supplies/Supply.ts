export interface Supply {
  _id: string
  name: string
  company: string
  code: string
  typeId: string
  unit?: string
  brand?: string
  compositon?: string
  quantity?: number
  activeIngredients?: Array<any>
  supply?: string | any
  icon?: string
  total?: number | number
  eiqTotal?: number | number
}
