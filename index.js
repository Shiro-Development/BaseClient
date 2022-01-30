require('dotenv').config()
const chalk = require('chalk')
const fork = require('child_process').fork

const botFile = 'src/bot.js'

for (let i = 0; i < process.env.WORKER_COUNT; i++) {
  const child = fork(botFile)
  child.id = i
  child.on('message', message => {
    console.log(`${chalk.blueBright(`[ Worker ${child.id} ]`)} ${message}`)
  })
}
