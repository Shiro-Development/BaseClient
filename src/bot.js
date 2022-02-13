const client = require('./Client')
const chalk = require('chalk')

client.on('ready', async _ => {
  process.send ? process.send(`${chalk.yellowBright('[ CLIENT AMQ ]')} Connected to AMQP!`) : console.log(`${chalk.yellowBright('[ CLIENT AMQ ]')} Connected to AMQP!`)
})
