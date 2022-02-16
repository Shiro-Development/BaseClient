#!/usr/bin/env node
const amqp = require('amqp')
const EventEmitter = require('events')
const zlib = require('zlib')
const ClientCache = require('./cache')
const util = require('../util')
const { Interactions } = require('../Class/discord')

/**
 * Handles the amqp client connection for the bot
 * @type Class
 */
class Client extends EventEmitter {
  /**
   * Client for dispers gateway
   * @param {Object} options Client configuration options
   * @param {String} options.botToken Bot token of the bot you're handling
   * @param {?String} options.clientId Client ID of the application. **NOTE**: This is only used for interaction handling as it relies on the client ID not the bot ID.
   * @param {Number} options.shardId Shard count defined from gateway, this is used to calculate guild shard ID's in some cases. You can update this during runtime and it will work client-wide.
   * @param {Object} options.amqp AMQP driver configuration
   * @param {String} options.amqp.host The host of the AMQP server
   * @param {String} options.amqp.eventExchange The exchange you're using to recieve events from dispers.
   * @param {String} options.amqp.cacheExchange The exchange you'll be sending cache data requests too.
   */
  constructor (options = {
    botId: '',
    botToken: '',
    clientId: '',
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
    this.cache = null
  }

  /**
   * @protected
   * @description Ready function for amqp
   */
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
      this.client.cache = new ClientCache(client)
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

/**
 * Start client when connection is established
 */
client.conn.on('ready', () => {
  client.amqpReady(client)
})

module.exports = client
