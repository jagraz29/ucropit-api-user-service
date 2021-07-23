import jwt from 'jsonwebtoken'

export const generateAuthTokenPin = (id): string => {
  return jwt.sign({ id }, process.env.AUTH_KEY_PIN_JWT, { expiresIn: '1h' })
}

export const checkTokenPin = async (
  tokenParam: string
): Promise<void | boolean> => {
  let token = ''
  if (tokenParam && tokenParam.startsWith('Bearer ')) {
    token = tokenParam.slice(7, tokenParam.length)
  }

  if (!token) {
    return false
  }
  if (token) {
    return jwt.verify(
      token,
      process.env.AUTH_KEY_PIN_JWT,
      async (err, decoded) => {
        if (err) {
          return false
        }
        return true
      }
    )
  }
}
