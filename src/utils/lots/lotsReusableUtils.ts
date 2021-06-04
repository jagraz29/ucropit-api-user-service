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

export const exitsLotsReusableInCollectionLots = (identifier, reusableLots): object[] => {
  const reusableLotsAsObjectId = reusableLots.map(id => mongoose.Types.ObjectId(id))
  const pipeline = [ {
    $match: {
      identifier
    }
  }, {
    $unwind: '$lots'
  }, {
    $unwind: '$lots.data'
  }, {
    $project: {
      '_id': '$lots.data'
    }
  }, {
    $match: {
      _id: { $in: reusableLotsAsObjectId }
    }
  } ]
  return pipeline
}

export const lotsReusableNotExistInDB = (lotsInDB, reusableLots): string[] => {
  let results = []
  const lotsInDBAsString = lotsInDB.map(element => element._id.toString())
  for (let lot of reusableLots) {
    if (!lotsInDBAsString.includes(lot.toString())) results.push(lot.toString())
  }
  return results
}

export const responseReusableLotsMessageError = (reusableLots, message) => {
  if (reusableLots.length) {
    return {
      error: true,
      message,
      lotsNotAvailable: reusableLots
    }
  }
  return { error: false }
}
