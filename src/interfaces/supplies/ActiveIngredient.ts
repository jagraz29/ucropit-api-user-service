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

export interface ActiveIngredientUnified {
  active_principle: string
  active_ingredient_unified: string
  eiq: string
}
