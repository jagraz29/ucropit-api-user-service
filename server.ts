require('dotenv').config()

import express, { Application, Request, Response, NextFunction } from 'express'
import bodyParser from 'body-parser'
import swaggerUI from 'swagger-ui-express'
import { swaggerDocs } from './config/swagger'
import { errorHandler } from './src/loggin/error-handler'
import morgan from 'morgan'

import { connectDb } from './src/models'
import routes from './src/routes/v1'

const port = process.env.NODE_PORT || 3000
const app: Application = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json())
app.use(morgan('tiny'))

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))
app.use('/v1', routes)

app.use(async (err: Error, req: Request, res: Response, next: NextFunction) => {
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

connectDb().then(() => {
  app.listen(port, function () {
    console.log(`App is listening on port ${port}!`)
  })
})
