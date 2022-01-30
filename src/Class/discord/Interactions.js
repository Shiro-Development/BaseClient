const { default: axios } = require('axios')
const FormData = require('form-data')
const { constants } = require('../../util')

/**
 * Follow up an interaction made in the discord client.
 * @param {*} appID The clients ID
 * @param {*} interactionToken The token provided by the `InteractionCreate` event
 * @param {*} data Data given by the `InteractionCreate` event
 * @returns {Promise<Object>} HTTP Result from the follow up
 */
exports.followUp = async (appID, interactionToken, data) => {
  if (data instanceof FormData) {
    await axios.post(`${constants.discord.interactions}${appID}/${interactionToken}/callback`, data.getBuffer(), {
      headers: {
        ...data.getHeaders(),
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
    return {
      id: appID
    }
  }
  const json = JSON.stringify(data)
  return axios.post(`${constants.discord.interactions}${appID}/${interactionToken}/callback`, json, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
  })
}

exports.followUpDeferred = async (appID, interactionToken, data) => {
  if (data instanceof FormData) {
    await axios.post(`${constants.discord.webhooks}${appID}/${interactionToken}`, data.getBuffer(), {
      headers: {
        ...data.getHeaders(),
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
    return {
      id: appID
    }
  }
  const json = JSON.stringify(data)
  return axios.post(`${constants.discord.webhooks}${appID}/${interactionToken}`, json, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
  })
}

exports.edit = async (appID, interactionToken, data, messageID = '@original') => {
  const json = JSON.stringify(data)
  return axios.patch(`${constants.discord.webhooks}${appID}/${interactionToken}/messages/${messageID}`, json, {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
  })
}

exports.delete = async (appID, interactionToken, messageID = '@original') => {
  return axios.delete(`${constants.discord.webhooks}${appID}/${interactionToken}/messages/${messageID}`, '', {
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
      'User-Agent': 'Discord-bot'
    }
  })
}
