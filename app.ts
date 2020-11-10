require('dotenv').config()

import express, { Application, Request, Response, NextFunction } from 'express'
import { basePath } from './src/utils/Files'
import swaggerUI from 'swagger-ui-express'
import { swaggerDocs } from './config/swagger'
import { errorHandler } from './src/loggin/error-handler'
import morgan from 'morgan'
import cors from 'cors'
import routes from './src/routes/v1'
import fileUpload from 'express-fileupload'
import path from 'path'

const app: Application = express()

import jwt from './src/utils/auth/strategies/jwt'

app.use(jwt.initialize())
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))
app.use(
  fileUpload({
    createParentPath: true
  })
)

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, { explorer: true })
)

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', path.join(basePath(), 'views'))

app.use('/v1', routes)

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)
  if (errorHandler.isCastErrorMongoose(err)) {
    res.status(404).json({
      err: {
        message: 'Not Found Resources'
      }
    })
  }

  if (!errorHandler.isTrustedError(err)) {
    res.status(500).json({
      err: {
        message: err.message,
        stack: err.stack
      }
    })
  }
  await errorHandler.handleError(err)
})

export default app
