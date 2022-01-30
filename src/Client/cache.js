const { nanoid } = require('nanoid')
const { Guild, Channel, User, Role } = require('../Class/discord')
const Member = require('../Class/discord/Member')

class ClientCache {
  /**
   * @param {Client} client The bots amqp client
   */
  constructor (client) {
    this.client = client
  }

  requestTimeout (cID) {
    process.send(`[ CLNT CACHE ] Cache request (${cID}) timed out after 5s`)
  }

  /**
   * Fetch a guild from the gateway cache
   * @param {String} shardID shard ID the request is being sent from
   * @param {String} guildID guild ID snowflake
   * @returns {Promise<Guild>} Cached guild data from the gateway
   */
  getGuild (shardID, guildID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 2, d: { id: guildID } })
      // correlationID
      const cID = `guilds-${nanoid()}`

      // Cache timeout
      setTimeout(_ => {
        if (process.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve(undefined)
        }
      }, 5000)

      // Catch event
      this.client.once(`cache-${cID}`, msg => {
        const guild = new Guild(this.client, msg)
        resolve(guild)
      })
      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }

  /**
   * Fetch a channel from the gateway cache
   * @param {String} shardID The shard ID the request is being sent from
   * @param {String} channelID The channel ID to fetch
   * @param {String} guildID The channel the guild is in
   * @returns {Promise<Channel>} Cached channel data from the gateway
   */
  getChannel (shardID, channelID, guildID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 5, d: { id: channelID, gid: guildID } })
      // correlationID
      const cID = `channels-${nanoid()}`

      // Cache timeout
      setTimeout(_ => {
        if (process.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve(undefined)
        }
      }, 5000)

      // Catch event
      this.client.once(`cache-${cID}`, msg => {
        const channel = new Channel(this.client, msg)
        resolve(channel)
      })

      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }

  /**
   * Fetch a user from the gateway cache
   * @param {String} shardID The shard ID the request is being sent from
   * @param {String} userID The user ID you want the data for
   * @returns {Promise<User>} Cached user data from the gateway
   */
  getUser (shardID, userID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 1, d: { id: userID } })
      // correlationID
      const cID = `users-${nanoid()}`
      // Cache timeout
      setTimeout(_ => {
        if (process.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve(undefined)
        }
      }, 5000)
      // Catch event
      this.client.once(`cache-${cID}`, msg => {
        const user = new User(this.client, msg)
        resolve(user)
      })
      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }

  /**
   * Fetch a member from a guild in the gateway cache
   * @param {String} shardID The shard ID the request is being sent from
   * @param {String} userID The user ID you want the data for
   * @param {String} guildID The guild ID you want the data for
   * @returns {Promise<User>} Cached member data from the gateway
   */
  getMember (shardID, userID, guildID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 3, d: { id: userID, gid: guildID } })
      // correlationID
      const cID = `members-${nanoid()}`
      // Catch event
      setTimeout(_ => {
        if (this.client.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve(undefined)
        }
      }, 5000)
      this.client.once(`cache-${cID}`, msg => {
        msg.guildID = guildID
        msg.id = userID
        if (msg.response === 404) resolve(undefined)
        const member = new Member(this.client, msg)
        resolve(member)
      })
      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }

  /**
   * Fetch the roles for a guild from the gateway cache
   * @param {String} shardID The shard ID requesting the data
   * @param {String} guildID The guild ID to fetch the roles from
   * @returns {Promise<Object[]>} An array of roles for guild requested
   */
  getGuildRoles (shardID, guildID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 10, d: { gid: guildID } })
      // correlationID
      const cID = `roles-${nanoid()}`
      // Add timeout
      setTimeout(_ => {
        if (process.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve([])
        }
      }, 5000)
      // Catch event
      this.client.once(`cache-${cID}`, roles => {
        roles = roles.map(r => new Role(this.client, r))
        resolve(roles)
      })
      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }

  getStats (shardID) {
    return new Promise((resolve, reject) => {
      // Stringify content
      const json = JSON.stringify({ t: 99 })
      // correlationID
      const cID = `stats-${nanoid()}`

      // Cache timeout
      setTimeout(_ => {
        if (process.eventNames().includes(`cache-${cID}`)) {
          this.requestTimeout(cID)
          process.removeAllListeners(`cache-${cID}`)
          resolve({})
        }
      }, 5000)

      // Catch event
      this.client.once(`cache-${cID}`, stats => {
        resolve(stats)
      })
      // Send content to exchange
      this.client.conn.exchanges[process.env.CACHE_EXCHANGE_NAME].publish(`${shardID}`, json, {
        replyTo: this.client.cacheReplyName,
        correlationId: cID
      })
    })
  }
}

module.exports = ClientCache
