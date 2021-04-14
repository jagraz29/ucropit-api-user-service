import chalk from 'chalk'

const Agenda = require('agenda')

const connectionOpts = {
  db: {
    address: `${process.env.DATABASE_URL}`,
    collection: 'agendaJobs'
  }
}

const agenda = new Agenda(connectionOpts)

const jobTypes = ['email']

jobTypes.forEach(type => {
  require('./agenda/' + type)(agenda)
})

if (jobTypes.length) {
  if (process.env.AGENDA) {
    agenda
      .start()
      .then(async () => {
        await agenda.purge()
        console.log(`${chalk.green('=====AGENDA ENABLED====')}`)
      })
      .catch(err => {
        console.log(err)
      })
  } else {
    console.log(`${chalk.green('=====AGENDA DISABLED====')}`)
  }
}

export default agenda
