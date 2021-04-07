class Numbers {
  getRandom (size = 6) {
    return Math.floor(
      Math.pow(10, size - 1) +
        Math.random() * (Math.pow(10, size) - Math.pow(10, size - 1) - 1)
    )
  }

  roundToTwo (num: number) {
    return Math.round((num + Number.EPSILON) * 100) / 100
  }
}

export default new Numbers()
