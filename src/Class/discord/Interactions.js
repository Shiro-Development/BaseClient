const FormData = require('form-data')
const { constants, httpRequestHandler } = require('../../util')

class Interactions {
  constructor (client) {
    this.client = client
  }

  /**
 * Follow up an interaction made in the discord client.
 * @param {String} interactionToken The token provided by the `InteractionCreate` event
 * @param {Object} data Data to send to the discord API to follow up the interaction
 * @returns {Promise<Object>} HTTP Result from the follow up
 */
  async followUp (interactionToken, data) {
    if (data instanceof FormData) {
      return httpRequestHandler.post(`${constants.discord.interactions}${this.client.options.clientId || this.client.options.botId}/${interactionToken}/callback`, data.getBuffer(), {
        headers: {
          ...data.getHeaders(),
          Authorization: `Bot ${this.client.options.botToken}`,
          'User-Agent': 'Discord-bot'
        }
      })
    }
    const json = JSON.stringify(data)
    return httpRequestHandler.post(`${constants.discord.interactions}${this.client.options.clientId || this.client.options.botId}/${interactionToken}/callback`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.client.options.botToken}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async followUpDeferred (interactionToken, data) {
    if (data instanceof FormData) {
      return httpRequestHandler.post(`${constants.discord.webhooks}${this.client.options.clientId || this.client.options.botId}/${interactionToken}`, data.getBuffer(), {
        headers: {
          ...data.getHeaders(),
          Authorization: `Bot ${this.client.options.botToken}`,
          'User-Agent': 'Discord-bot'
        }
      })
    }
    const json = JSON.stringify(data)
    return httpRequestHandler.post(`${constants.discord.webhooks}${this.client.options.clientId || this.client.options.botId}/${interactionToken}`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.client.options.botToken}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async edit (interactionToken, data, messageID = '@original') {
    const json = JSON.stringify(data)
    return httpRequestHandler.patch(`${constants.discord.webhooks}${this.client.options.clientId || this.client.options.botId}/${interactionToken}/messages/${messageID}`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.client.options.botToken}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async delete (interactionToken, messageID = '@original') {
    return httpRequestHandler.delete(`${constants.discord.webhooks}${this.client.options.clientId || this.client.options.botId}/${interactionToken}/messages/${messageID}`, '', {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${this.client.options.botToken}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }
}

module.exports = Interactions
