import app from '../../../app'

export function connect (port) {
  return app.listen(port)
}
