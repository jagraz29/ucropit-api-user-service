require('dotenv').config()

import chalk from 'chalk'
import app from './app'
import { connectDb } from './src/models'

const port = process.env.NODE_PORT || 3000

connectDb().then(() => {
  app.listen(port, function () {
    console.log(
      `${chalk.green('[Ucrop.it-API]:')} App is listening on port ${port}!`
    )
  })
})
