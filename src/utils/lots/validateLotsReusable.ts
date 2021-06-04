import { map, flatten, difference } from 'lodash'

export const validateLotsReusable = (reusableLots, cropsList): string[] => {
  let results = []
  for (let crop of cropsList) {
    const lostInData = flatten(map(crop.lots, 'data'))
    results = results.concat(difference(reusableLots, lostInData))
  }
  return results
}
