const { default: axios } = require('axios')

class DatabaseUser {
  constructor (client, id) {
    this.client = client
    this.id = id
    this.avatar_url = 'a123a'
    this.username = null
    this.discriminator = null
    this.balance = 0
    this.votes = 0
    this.vote_streak = 0
    this.last_voted = '1990-01-31T00:00:00+00:00'
    this.boosted = false
    this.vote_lock_exempt = false
    this.hasVoted = null
  }

  /**
   * @param {Object} options
   * @param {Boolean} options.ignoreCache Whether or not to skip checking redis
   * @returns {GuildSettings} The guilds settings
   */
  async fetch (options = { ignoreCache: false }) {
    const voteTimeout = 43200000
    if (options.ignoreCache !== true) {
      const cachedSettings = await this.client.redis.get(`${process.env.REDIS_TAG}:users:${this.id}`)
      if (cachedSettings) {
        const parsed = JSON.parse(cachedSettings)
        Object.keys(parsed).forEach(k => {
          if (!['id', 'client'].includes(k)) {
            if (k === 'last_voted') {
              const lastVoted = new Date(parsed[k])
              if ((Date.now() - lastVoted.getTime() <= voteTimeout)) this.hasVoted = true
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
            if ((Date.now() - lastVoted.getTime() <= voteTimeout)) this.hasVoted = true
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
    }).catch(e => console.log(e.response.data))
    await this.client.redis.del(`${process.env.REDIS_TAG}:users:${this.id}`)
    await this.fetch()
    return { ...this, _saveResult: result }
  }

  toJSON () {
    const object = {}
    Object.keys(this).forEach(k => {
      if (!['client'].includes(k) && this[k] !== null) {
        if (k === 'avatar_url' || this[k] === null || this[k] === undefined || !this[k]) object[k] = 'none'
        if (k === 'last_voted') return null
        else object[k] = this[k]
      }
    })
    return JSON.stringify(object)
  }
}

module.exports = DatabaseUser
