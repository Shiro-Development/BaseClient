const { default: axios } = require('axios')

class Mutes {
  constructor (client, guildID) {
    this.client = client
    this.guildID = guildID
    this.mutes = []
  }

  async fetchAll () {
    const { data } = await axios.get(`${process.env.DB_API_URL}/mutes`, { headers: { authorization: process.env.DB_API_AUTH } })
    this.mutes = data
    return this
  }

  /**
   * @param {Object} options
   * @param {Boolean} options.ignoreCache Whether or not to skip checking redis
   * @returns {GuildSettings} The guilds settings
   */
  async fetch () {
    const { data } = await axios.get(`${process.env.DB_API_URL}/guild/${this.guildID}/mutes`, { headers: { authorization: process.env.DB_API_AUTH } })
    this.mutes = data
    return this
  }

  async remove (caseID) {
    const result = await axios.delete(`${process.env.DB_API_URL}/guild/${this.guildID}/mutes/${caseID}`, {
      headers:
      {
        authorization: process.env.DB_API_AUTH
      }
    })
    await this.client.redis.del(`${process.env.REDIS_TAG}:guilds:${this.guildID}:mutes`)
    await this.fetch()
    return { ...this, _saveResult: result }
  }

  async set (caseID, unmuteAt = new Date().toISOString(), permanent) {
    const json = JSON.stringify({
      case_id: caseID,
      unmute_at: unmuteAt,
      guild_id: this.guildID,
      perma: permanent
    })
    const result = await axios.post(`${process.env.DB_API_URL}/guild/${this.guildID}/mutes`, json, {
      headers:
      {
        authorization:
        process.env.DB_API_AUTH,
        'Content-Type': 'application/json'
      }
    })
    await this.client.redis.del(`${process.env.REDIS_TAG}:guilds:${this.guildID}:mutes`)
    await this.fetch()
    return { ...this, _saveResult: result }
  }
}

module.exports = Mutes
