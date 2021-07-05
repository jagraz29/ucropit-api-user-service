export interface ActiveIngredient {
  _id: string
  name: { es: string; en?: string; pt?: string }
  eiq: number | string | any
}

export interface ActiveIngredientsSupply {
  activeIngredient: string
  eiqActiveIngredient: number
  composition: number
  eiq: number
}

export interface ActiveIngredientUnified {
  active_principle: string
  active_ingredient_unified: string
  eiq: string
}
