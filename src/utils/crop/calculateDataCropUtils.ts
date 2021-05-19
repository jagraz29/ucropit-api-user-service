import util from 'util'

export const calculateDataCropUtils = ({ surface, pay, dateCrop, name, activities, lots }): Object => {
  // console.log(util.inspect(lots, { showHidden: false, depth: null }))
  return {
    surface,
    volume: surface * (pay ? pay : 0),
    pay,
    dateCrop,
    name
  }
}
