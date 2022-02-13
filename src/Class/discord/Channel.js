const { default: axios } = require('axios')
const FormData = require('form-data')
const { constants } = require('../../util')
const Message = require('./Message')

/**
 * Discord channel constructor
 */
class Channel {
  /**
   * @param {Client} client The client's amqp connection
   * @param {Object} channel The channel object
   * @param {Guild|String} guild The guild ID or guild object
   */
  constructor (client, channel, guild) {
    this.client = client
    this.id = channel.id
    this.guild = guild || channel.guild_id
    this.type = 0
    this.nsfw = channel.nsfw
    this.name = channel.name
    this.topic = channel.topic
    this.position = channel.position
    this.permissionOverwrites = channel.permission_overwrites
    this.lastMessageID = channel.last_message_id
    this.rateLimitPerUser = channel.rate_limit_per_user
    this.parentID = channel.parent_id
  }

  async fetchMessage (messageID) {
    const headers = {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
    return axios.get(`${constants.discord.api}/channels/${this.id}/messages/${messageID}`, { headers: headers }).then(({ data }) => {
      const msg = new Message(this.client, data)
      return msg
    })
  }

  /**
   * @param {Object|String} content An object or string to send a message via the discord API
   * @returns {Promise<Message>} The message you sent
   */
  async send (content) {
    let json
    let headers = {
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
    if (content instanceof FormData) {
      headers = { ...headers, ...content.getHeaders() }
      return axios.post(`${constants.discord.api}/channels/${this.id}/messages`, content.getBuffer(), { headers: headers, 'Content-Type': 'application/json' }).then(({ data }) => {
        const msg = new Message(this.client, data)
        return msg
      })
    }

    if (typeof content === 'object') json = JSON.stringify(content)
    else {
      json = JSON.stringify({
        content
      })
    }
    headers['Content-Type'] = 'application/json'
    return axios.post(`${constants.discord.api}/channels/${this.id}/messages`, json, { headers: headers, 'Content-Type': 'application/json' }).then(({ data }) => {
      const msg = new Message(this.client, data)
      return msg
    })
  }

  /**
   *
   * @param {Number} amount Amount of messages to delete.
   */
  async bulkDelete (amount = 50) {
    if (typeof amount !== 'number') throw TypeError('Amount must be a number')
    if (amount < 2 || amount > 100) throw RangeError('Bulk Delete Amount must be between 2-100')

    let messages = (await axios.get(`${constants.discord.api}/channels/${this.id}/messages?limit=${amount}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })).data

    messages = messages
      .filter(m => {
        const now = new Date()
        const messageCreation = new Date(m.timestamp)
        return (now.getTime() - messageCreation.getTime()) < 1209600000
      })
      .filter(m => messages.filter(ms => ms.id === m.id).length === 1)
      .map(m => { return m.id })

    if (messages.length < 2) return { messages: [] }

    await axios.post(`${constants.discord.api}/channels/${this.id}/messages/bulk-delete`, { messages: messages }, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot',
        'Content-Type': 'application/json'
      }
    })
    return { messages: messages }
  }
}

module.exports = Channel
