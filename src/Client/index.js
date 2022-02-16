#!/usr/bin/env node
const amqp = require('amqp')
const EventEmitter = require('events')
const zlib = require('zlib')
const ClientCache = require('./cache')
const util = require('../util')
const { Interactions } = require('../Class/discord')
const Redis = require('../Class/Redis')
const { Influx } = require('../Class/metrics')

/**
 * Handles the amqp client connection for the bot
 * @type Class
 */
class Client extends EventEmitter {
  constructor () {
    super()
    this.util = util
    this.user = {
      id: process.env.BOT_ID
    }
    /**
     * Redis Handler
     * @type {Redis}
     */
    this.redis = new Redis('Cache', 0, {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth: process.env.REDIS_AUTH
    })
    this.gatewayCache = new Redis('Gateway', 1, {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      auth: process.env.REDIS_AUTH
    })
    this.influxMetrics = new Influx('metrics')
    this.conn = amqp.createConnection({ url: `amqp://${process.env.AMQP_HOST}` })
    this.Interactions = Interactions
    /**
     * Cache handler for the bot
     * @type {ClientCache}
     */
    this.cache = {}
  }

  async amqpReady (client) {
    client.conn.exchange(process.env.CACHE_EXCHANGE_NAME, { type: 'direct', durable: true, autoDelete: false })
    client.conn.exchange(process.env.VOICE_EXCHANGE, { type: 'direct', durable: true, autoDelete: false })

    // Cache reply queue
    client.conn.queue('', {
      durable: false,
      exclusive: false,
      autoDelete: true
    }, (queue) => {
      this.cacheReplyName = queue.name
      this.emit('cacheReady')
      // console.log('Cache Reply Queue: ', this.cacheReplyName)
      queue.subscribe(function (message, _, headers) {
        if (headers.type === '404') {
          client.emit(`cache-${headers.correlationId}`, { response: 404, message: 'Not found' })
        } else {
          message = zlib.inflateSync(message.data)
          try { message = JSON.parse(message) } catch { return }
          client.emit(`cache-${headers.correlationId}`, message)
        }
      })
    })

    // Event queue
    client.conn.queue('', {
      durable: false,
      exclusive: true,
      autoDelete: true
    }, (queue) => {
      if (!client.conn.errored) {
        client.emit('ready')
      }
      delete client.conn.errored
      client.eventQueueName = queue.name
      queue.bind(process.env.ALL_EVENT_EXCHANGE_NAME, '1000')
      queue.subscribe(function (message) {
        client.influxMetrics.incrementMetric('events')
        message = zlib.inflateSync(message.data)
        message = JSON.parse(message)
        client.emit('raw', message)
        client.emit(message.event.t
          .split('_')
          .map(v => `${v.substr(0, 1)}${v.substr(1, v.length).toLowerCase()}`)
          .join(''),
        message)
      })
    })
  }
}
const client = new Client()

// const open = amqp.connect(`amqp://${process.env.AMQP_HOST}`)
// const connection = amqp.createConnection({ url: `amqp://${process.env.AMQP_HOST}` })

// add this for better debuging
client.conn.on('error', function (e) {
  client.conn.errored = true
  process.send ? process.send(`Error from amqp:\n ${e?.stack}`) : console.log('Error from amqp: \n', e?.stack)
})

client.conn.on('ready', () => {
  client.amqpReady(client)
})
// Wait for connection to become established.

client.cache = new ClientCache(client)

module.exports = client
