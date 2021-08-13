require('dotenv').config()
require('./src/jobs')

import express, { Application, Request, Response, NextFunction } from 'express'
import swaggerUI from 'swagger-ui-express'
import fileUpload from 'express-fileupload'
import * as Sentry from '@sentry/node'
import cors from 'cors'
import morgan from 'morgan'
import path from 'path'
import * as i18n from 'i18n'

import { basePath } from './src/utils/Files'
import { swaggerDocs } from './config/swagger'
import { errorHandler } from './src/loggin/error-handler'
import routes from './src/routes/v1'

const app: Application = express()

if (process.env.NODE_ENV !== 'local') {
  Sentry.init({
    dsn: 'https://07781985e6084c509ea11ab221afe082@o617969.ingest.sentry.io/5751081'
  })
}

import jwt from './src/utils/auth/strategies/jwt'

i18n.configure({
  defaultLocale: 'es',
  locales: ['es', 'en', 'pt'],
  directory: path.join(__dirname, 'config', 'locales'),
  objectNotation: true,
  updateFiles: false,
  register: global
})
app.use(Sentry.Handlers.requestHandler() as express.RequestHandler)
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

app.use(i18n.init)

app.use(
  '/api-docs',
  swaggerUI.serve,
  swaggerUI.setup(swaggerDocs, { explorer: true })
)

app.use('/api/v1/swagger-json', (req, res) => {
  res.json(swaggerDocs)
})

app.use(express.static('public'))

app.set('view engine', 'pug')
app.set('views', path.join(basePath(), 'views'))

app.use('/v1', routes)

app.use(Sentry.Handlers.errorHandler() as express.ErrorRequestHandler)

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
  console.log(err)

  if (errorHandler.isErrorIntegration(err)) {
    res.status(400).json(errorHandler.getCodeErrorIntegration(err))
  }

  if (errorHandler.isErrorNotFoundDocument(err)) {
    return res.status(404).json({
      err: {
        message: err.message,
        code: err.name
      }
    })
  }

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
