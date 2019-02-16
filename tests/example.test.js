function absolute(number) {
  if (number > 0) return number
  if (number < 0) return -number
  return 0
}

function getCurrencies() {
  return ['USD', 'AUD']
}

function getProduct() {
  return { id: 1, name: 'Ariel 5lt' }
}

describe('currencies', () => {
  it('should return supported currencies', () => {
    const result = getCurrencies()
    expect(result).toEqual(expect.arrayContaining(['AUD', 'USD']))
  })
})

describe('products', () => {
  it('should return the product with the given id', () => {
    const result = getProduct()
    expect(result).toEqual({ id: 1, name: 'Ariel 5lt' })
    expect(result).toMatchObject({ name: 'Ariel 5lt' })
    expect(result).toHaveProperty('id')
  })
})

describe('absolute', () => {
  it('should return a positive number if input is positive', () => {
    const result = absolute(1)
    expect(result).toBe(1)
  })

  it('should return a negative number if input is negative', () => {
    const result = absolute(-1)
    expect(result).toBe(1)
  })

  it('should return a zero number if input is zero', () => {
    const result = absolute(0)
    expect(result).toBe(0)
  })
})