export const generateArrayPercentage = (value, len, arry) => {
  if (arry) {

    for (let i = 0; i < len; i++) {
      arry[ i ] = value
    }

  } else {

    arry = []

    for (let i = 0; i < len; i++) {
      arry.push(value)
    }

  }

  return arry
}
