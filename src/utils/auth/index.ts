import bcrypt from 'bcrypt'

export const hashPassword = (token, saltFact) =>
  new Promise((resolve, reject) => {
    bcrypt.genSalt(saltFact, function (error, salt: string) {
      if (error) reject(error)

      bcrypt.hash(token, salt, function (err, hash: string) {
        if (err) reject(err)
        resolve(hash)
      })
    })
  })
export * from './managementTokenJwtPin'
