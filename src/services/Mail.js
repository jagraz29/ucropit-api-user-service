const nodemailer = require('nodemailer')
const mg = require('nodemailer-mailgun-transport')
const User = require('../models').users
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
  // uncomment below to send emails in development/test env:
  send: true,
  transport: nodemailer.createTransport(mg(auth))
})

class Mail {
  static async send ({ template = '', to = '', data = {} }) {
    email
      .send({
        template: template,
        message: { to, from: 'no-reply@ucrop.it' },
        locals: { ...data }
      })
      .then(console.log)
      .catch(console.error)
  }

  static async sendNotificationMail ({ data, usersID = [], type }) {
    if (usersID === undefined) throw new Error('users not given are required')

    try {
      const users = await User.findAll({ where: { id: usersID } })

      if (users !== null) {
        const mails = await Mail.send({
          template: type,
          to: users.map(el => el.email),
          data: {
            ...data,
            url: process.env.FRONT_URL
          }
        })
      }
    } catch (error) {
      throw new Error(error)
    }
  }
}

module.exports = Mail
