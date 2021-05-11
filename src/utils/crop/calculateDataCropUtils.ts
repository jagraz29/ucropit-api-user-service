export const calculateDataCropUtils = ({ surface, pay, dateCrop, name, activities }): Object => {
  return {
    surface,
    volume: surface * (pay ? pay : 0),
    pay,
    dateCrop,
    name
  }
}
