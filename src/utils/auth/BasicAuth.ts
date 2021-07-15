import auth from 'basic-auth'

export const checkAuth = (req, res, next) => {
  const user = auth(req)

  if (
    !req.headers.authorization ||
    req.headers.authorization.indexOf('Basic ') === -1
  ) {
    res
      .set({
        'WWW-Authenticate': 'Basic realm="simple-admin"'
      })
      .send(401)
  }

  if (!user || check(user.name, user.pass)) {
    next()
  } else {
    res
      .set({
        'WWW-Authenticate': 'Basic realm="simple-admin"'
      })
      .send(401)
  }
}

const check = (name, pass) => {
  let valid = true

  valid = name === process.env.BASIC_AUTH_USER && valid
  valid = pass === process.env.BASIC_AUTH_PASS && valid

  return valid
}
