const { default: axios } = require('axios')

class DatabaseUser {
  constructor (client, id) {
    this.client = client
    this.id = id
    this.avatar_url = null
    this.username = null
    this.discriminator = null
    this.balance = null
    this.votes = null
    this.vote_streak = null
    this.last_voted = null
    this.boosted = null
    this.vote_lock_exempt = null
    this.hasVoted = null
  }

  /**
   * @param {Object} options
   * @param {Boolean} options.ignoreCache Whether or not to skip checking redis
   * @returns {GuildSettings} The guilds settings
   */
  async fetch (options = { ignoreCache: false }) {
    if (options.ignoreCache !== true) {
      const cachedSettings = await this.client.redis.get(`${process.env.REDIS_TAG}:users:${this.id}`)
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings)
        Object.keys(parsed).forEach(k => {
          if (!['id', 'client'].includes(k)) {
            if (k === 'last_voted') {
              const lastVoted = new Date(parsed[k])
              if ((Date.now() - lastVoted.getTime() <= 43200)) this.hasVoted = true
              else this.hasVoted = false
            }
            if (parsed[k]) this[k] = parsed[k]
          }
        })
        return this
      }
    }
    const { data } = await axios.get(`${process.env.DB_API_URL}/users/${this.id}`, { headers: { authorization: process.env.DB_API_AUTH } })
    if (data) {
      Object.keys(data).forEach(k => {
        if (!['id', 'client'].includes(k)) {
          if (k === 'last_voted') {
            const lastVoted = new Date(data[k])
            if ((Date.now() - lastVoted.getTime() <= 43200)) this.hasVoted = true
            else this.hasVoted = false
          }
          if (data[k]) this[k] = data[k]
        }
      })
      await this.client.redis.set(`${process.env.REDIS_TAG}:users:${this.id}`, this.toJSON())
      return this
    } else { return this }
  }

  async save () {
    const result = await axios.post(`${process.env.DB_API_URL}/users/${this.id}`, this.toJSON(), {
      headers:
      {
        authorization:
        process.env.DB_API_AUTH,
        'Content-Type': 'application/json'
      }
    })
    await this.client.redis.del(`${process.env.REDIS_TAG}:users:${this.id}`)
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

module.exports = DatabaseUser
