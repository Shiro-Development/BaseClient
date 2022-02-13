const { default: axios } = require('axios')

class GuildSettings {
  constructor (client, id) {
    this.client = client
    this.id = id
    this.serverprefix = process.env.PREFIX
    this.premium = false
    this.vote_lock_exempt = false
    this.log_channel = ''
    this.mod_log_channel = ''
    this.log_enabled = ''
    this.mod_log_enabled = false
    this.welcomer_enabled = false
    this.mute_role = false
  }

  /**
   * @param {Object} options
   * @param {Boolean} options.ignoreCache Whether or not to skip checking redis
   * @returns {GuildSettings} The guilds settings
   */
  async fetch (options = { ignoreCache: false }) {
    if (!options.ignoreCache) {
      const cachedSettings = await this.client.redis.get(`${process.env.REDIS_TAG}:guilds:${this.id}:settings`)
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings)
        Object.keys(parsed).forEach(k => {
          if (!['id', 'client'].includes(k)) {
            this[k] = parsed[k]
          }
        })
        return this
      }
    }
    const { data } = await axios.get(`${process.env.DB_API_URL}/guild/${this.id}`, { headers: { authorization: process.env.DB_API_AUTH } })
    if (data) {
      Object.keys(data).forEach(k => {
        if (!['id', 'client'].includes(k)) {
          this[k] = data[k]
        }
      })
      await this.client.redis.set(`${process.env.REDIS_TAG}:guilds:${this.id}:settings`, this.toJSON())
      return this
    } else { return this }
  }

  async save () {
    const result = await axios.post(`${process.env.DB_API_URL}/guild/${this.id}`, this.toJSON(), {
      headers:
      {
        authorization:
        process.env.DB_API_AUTH,
        'Content-Type': 'application/json'
      }
    })
    await this.client.redis.del(`${process.env.REDIS_TAG}:guilds:${this.id}:settings`)
    await this.fetch()
    return { ...this, _saveResult: result }
  }

  toJSON () {
    const object = {}
    Object.keys(this).forEach(k => {
      if (!['client'].includes(k) && this[k] !== null) {
        object[k] = this[k]
      }
    })
    return JSON.stringify(object)
  }
}

module.exports = GuildSettings
