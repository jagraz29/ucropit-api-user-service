export interface ActiveIngredient {
  _id: string
  name: { es: string; en?: string; pt?: string }
  eiq: Number | String | any
}

export interface ActiveIngredientsSupply {
  activeIngredient: string
  eiqActiveIngredient: Number
  composition: Number
  eiq: Number
}
