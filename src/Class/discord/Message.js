const { httpRequestHandler } = require('../../util')
const { constants } = require('../../util')
const Member = require('./Member')
const User = require('./User')

/**
 * The message constuctor for messages recieved from the gateway
 */
class Message {
  /**
   * @param {Client} client
   * @param {Object} message The message object
   * @param {String} message.id The message ID snowflake
   * @param {Date} message.createdAt The time the message was created
   * @param {Number} message.shardID The ID of the shard the message was recieved on
   * @param {String} message.channelID The ID of the channel the message was sent to
   * @param {?Channel} message.channel The [channel]{@link Channel} object for the message based on the channel ID
   * @param {String} message.guildID The ID of the guild the message was sent to
   * @param {?Guild} message.guild The [guild]{@link Guild} object for the message based on the channel ID
   * @param {User} message.author The [author]{@link User} object for the sender of the message
   * @param {String} message.content The content of the message
   * @param {Boolean} message.pinned Whether the message is pinged
   * @param {Number} message.type The type of message
   * @param {BitFieldResolvable} message.flags The flags of the message
   */
  constructor (client, message) {
    this.client = client
    this.id = message.id
    this.createdAt = new Date(message.timestamp)
    this.shardID = message.shardID
    this.channelID = message.channel_id
    this.channel = null
    this.guildID = message.guild_id
    this.guild = null
    this.author = new User(client, {
      ...message.author,
      member: new Member(client, {
        id: message.author.id,
        guildID: message.guild_id,
        ...message.member
      })
    })
    this.content = message.content
    this.embeds = message.embeds
    this.embed = message.embed
    this.pinned = message.pinned
    // Type and flags
    this.type = message.type
    this.flags = message.flags
  }

  async reply (content) {
    let json
    if (typeof content === 'object') json = JSON.stringify(content)
    else {
      json = JSON.stringify({
        content,
        message_reference: {
          guild_id: this.guild,
          channel_id: this.channel,
          message_id: this.id,
          fail_if_not_exists: false
        }
      })
    }
    return httpRequestHandler.post(`${constants.discord.api}/channels/${this.channelID}/messages`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    }).then(({ data }) => {
      const msg = new Message(this.client, data)
      return msg
    })
  }

  async edit (content) {
    let json
    if (typeof content === 'object') json = JSON.stringify(content)
    else {
      json = JSON.stringify({
        content
      })
    }
    return httpRequestHandler.patch(`${constants.discord.api}/channels/${this.channelID}/messages/${this.id}`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async delete () {
    return httpRequestHandler.delete(`${constants.discord.api}/channels/${this.channelID}/messages/${this.id}`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }
}

module.exports = Message
