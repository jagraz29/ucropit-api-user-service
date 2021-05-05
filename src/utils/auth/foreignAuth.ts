import jwt from 'jsonwebtoken'
import models from '../../models'
import { Request, Response } from 'express'

const ForeignCredential = models.ForeignCredential

export const checkToken = (
  req: Request | any,
  res: Response,
  next: Function
): void | Response => {
  let token = req.headers['x-access-token'] || req.headers['authorization']

  if (token && token.startsWith('Bearer ')) {
    token = token.slice(7, token.length)
  }

  if (token) {
    jwt.verify(
      token,
      process.env.AUTH_KEY_FOREIGN_JWT,
      async (err, decoded) => {
        if (err) {
          return res.status(403).json('TOKEN_IS_NOT_VALID')
        } else {
          req.decoded = decoded

          const credential = await ForeignCredential.findOne({
            _id: decoded.id
          })

          if (!credential) {
            return res.status(403).json('TOKEN_IS_NOT_SUPPLIED')
          }

          next()
        }
      }
    )
  } else {
    return res.status(403).json('TOKEN_IS_NOT_SUPPLIED')
  }
}
