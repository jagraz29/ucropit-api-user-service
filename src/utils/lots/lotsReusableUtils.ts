import { map, flatten } from 'lodash'
import mongoose from 'mongoose'

export const validateLotsReusable = (reusableLots, cropsList): string[] => {
  let results = []
  for (let crop of cropsList) {
    const lostInData = flatten(map(crop.lots, 'data')).map(id => id.toString())
    reusableLots.forEach(lot => {
      if (lostInData.includes(lot.toString())) results.push(lot.toString())
    })
  }
  return results
}

export const parseLotsReusableAsData = (lotsData): string[] => {
  return lotsData.map(item => {
    return {
      tag: item.tag,
      lots: item.lotIds.map(id => {
        return {
          _id: mongoose.Types.ObjectId(id)
        }
      })
    }
  })
}
