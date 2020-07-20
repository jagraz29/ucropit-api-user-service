import express = require('express')
import swaggerUI from 'swagger-ui-express'
import { swaggerDocs } from './config/swagger'
 
import routes from './src/routes/v1'

const app: express.Application = express()

app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerDocs))

app.use('/v1', routes)

app.listen(3000, function () {
  console.log('App is listening on port 3000!')
})
