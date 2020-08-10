const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')

const auth = {
  auth: {
    api_key: process.env.MAILGUN_APIKEY || '123123',
    domain: process.env.MAILGUN_DOMAIN
  }
}

const Email = require('email-templates')

const email = new Email({
  message: {
    from: process.env.MAIL_FROM
  },
  send: true,
  transport: nodemailer.createTransport(mg(auth))
})

class EmailService {
  async send ({ template = '', to = '', data = {} }) {
    email
      .send({
        template: template,
        message: { to, from: 'no-reply@ucrop.it' },
        locals: { ...data }
      })
      .then(console.log)
      .catch(console.error)
  }
}

export default new EmailService()
