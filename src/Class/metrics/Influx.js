const chalk = require('chalk')
const os = require('os')

const Influx = require('influx')
const influx = new Influx.InfluxDB({
  host: process.env.INFLUX_HOST,
  port: process.env.INFLUX_PORT,
  database: process.env.INFLUX_DATABASE
})

class InfluxMetrics {
  constructor (name = '') {
    this.name = name
    this.metrics = {}
    this.influx = influx
    this.influxEnabled = process.env.INFLUX_ENABLED || false

    if (this.influxEnabled) {
      influx.getDatabaseNames().then(databaseNames => {
        if (!databaseNames.includes(process.env.INFLUX_DATABASE)) {
          influx.createDatabase(process.env.INFLUX_DATABASE).then(_ => {
            process.send(`${chalk.redBright('[ IFX METRIC ]')} Created database as it didn't exist`)
          })
        }
      })

      function postInflux () {
        const measurements = Object.keys(this.metrics).map(m => this.metrics[m])
        this.influx.writePoints(measurements)
        process.send(`${chalk.redBright('[ IFX METRIC ]')} Posted data to influx`)
        Object.keys(this.metrics).forEach(m => {
          this.metrics[m].fields.count = 0
        })
      }

      const seconds = new Date().getSeconds()

      if (seconds === 30) {
        setInterval(postInflux.bind(this), 30000)
      } else if (seconds < 30) {
        setTimeout((_) => {
          postInflux.bind(this)()
          setInterval(postInflux.bind(this), 30000)
        }, (30 - seconds) * 1000)
      } else if (seconds > 30) {
        setTimeout((_) => {
          postInflux.bind(this)()
          setInterval(postInflux.bind(this), 30000)
        }, (seconds - 30) * 1000)
      }
    }
  }

  addMetric (name, type = 'metric') {
    this.metrics[name] = {
      measurement: `${type}-${name}`,
      tags: { host: `${os.hostname()}`, metric: name, gateway: process.env.INFLUX_GATEWAY_TAG, container: `${os.hostname()}` },
      fields: {
        count: 0
      }
    }
  }

  incrementMetric (name) {
    if (!this.metrics[name]) this.addMetric(name)
    this.metrics[name].fields.count++
  }

  duductMetric (name) {
    if (!this.metrics[name]) this.addMetric(name)
    this.metrics[name].fields.count--
  }
}

module.exports = InfluxMetrics
