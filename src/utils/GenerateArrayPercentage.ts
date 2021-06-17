export const generateArrayPercentage = (value: string, len: number, arrayList?: string[]) => {
  if (arrayList) {

    for (let i = 0; i < len; i++) {
      arrayList[ i ] = value
    }

  } else {

    arrayList = []

    for (let i = 0; i < len; i++) {
      arrayList.push(value)
    }

  }

  return arrayList
}
