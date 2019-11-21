const nodemailer = require('nodemailer');
const mg = require('nodemailer-mailgun-transport');

const auth = {
  auth: {
    api_key: process.env.MAILGUN_APIKEY || '123123',
    domain: process.env.MAILGUN_DOMAIN
  }
}

const Email = require('email-templates');

const email = new Email({
  message: {
    from: process.env.MAIL_FROM
  },
  // uncomment below to send emails in development/test env:
  send: true,
  transport: nodemailer.createTransport(mg(auth))
});


class Mail {
  static async send({ template = '', to = '', data = {} }) {
    email
      .send({
        template: template,
        message: { to },
        locals: { ...data }
      })
      .then(console.log)
      .catch(console.error);
  }

  async sendNotificationMail(req) {
    const { data, users, type } = req.body

    if (!users) throw new Error({ error: 'users not given are required' })

    try {
      const users = await User.findAll({ where: { id: users } })

      if (users !== null) {
        const mails = await Mail.send({ template: type, to: users, data })
      }
    } catch (error) {
      throw new Error(error);
    }
  }
}

module.exports = Mail