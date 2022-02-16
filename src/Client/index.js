#!/usr/bin/env node
const amqp = require('amqp')
const EventEmitter = require('events')
const zlib = require('zlib')
const ClientCache = require('./cache')
const util = require('../util')
const { Interactions } = require('../Class/discord')
const { Influx } = require('../Class/metrics')

/**
 * Handles the amqp client connection for the bot
 * @type Class
 */
class Client extends EventEmitter {
  /**
   * Client for dispers gateway
   * @param {Object} options Client configuration options
   */
  constructor (options = {
    botId: '',
    botToken: '',
    shardCount: 0,
    amqp: {
      host: '',
      eventExchange: '',
      cacheExchange: ''
    }
  }) {
    super()
    this.options = options
    this.util = util
    this.user = {
      id: options.botId
    }
    this.conn = amqp.createConnection({ url: `amqp://${options.amqp.host}` })
    this.Interactions = new Interactions(this)
    /**
     * Cache handler for the bot
     * @type {ClientCache}
     */
    this.cache = {}
  }

  async amqpReady (client) {
    client.conn.exchange(this.options.amqp.cacheExchange, { type: 'direct', durable: true, autoDelete: false })

    // Cache reply queue
    client.conn.queue('', {
      durable: false,
      exclusive: false,
      autoDelete: true
    }, (queue) => {
      this.cacheReplyName = queue.name
      this.emit('cacheReady')
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
      queue.bind(this.options.amqp.eventExchange, '1000')
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

/**
 * Error debugger
 */
client.conn.on('error', function (e) {
  client.conn.errored = true
  console.log('Error from amqp: \n', e?.stack)
})

client.conn.on('ready', () => {
  client.amqpReady(client)
})
// Wait for connection to become established.

client.cache = new ClientCache(client)

module.exports = client
