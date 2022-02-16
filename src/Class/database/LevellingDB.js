const { httpRequestHandler } = require('../../util')

class LevellingDB {
  constructor (client, userID, guildID) {
    this.client = client
    this.userID = userID
    this.guildID = guildID

    this.fetchedGuild = false
    this.fetchedGlobal = false

    this.globalUser = {
      xp: 0,
      rank: 0,
      totalUsers: 0
    }

    this.guildUser = {
      xp: 0,
      rank: 0,
      totalUsers: 0
    }
  }

  async globalTop10 () {
    const { data } = await httpRequestHandler.get(`${process.env.DB_API_URL}/levelling/top10`, { headers: { authorization: process.env.DB_API_AUTH } })
    return data
  }

  async guildTop10 () {
    const { data } = await httpRequestHandler.get(`${process.env.DB_API_URL}/levelling/guild/${this.guildID}/top10`, { headers: { authorization: process.env.DB_API_AUTH } }).catch(_ => { data: [] })
    return data
  }

  async fetchGlobal () {
    const { data } = await httpRequestHandler.get(`${process.env.DB_API_URL}/levelling/user/${this.userID}`, { headers: { authorization: process.env.DB_API_AUTH } })
    if (data) {
      const { xp, id, xp_rank: rank, total_users: totalUsers } = data
      this.globalUser = {
        id, xp, rank, totalUsers
      }
      this.fetchedGlobal = true
      return this
    } else { return this }
  }

  async fetchGuild () {
    const { data } = await httpRequestHandler.get(`${process.env.DB_API_URL}/levelling/guild/${this.guildID}/user/${this.userID}`, { headers: { authorization: process.env.DB_API_AUTH } })
    if (data) {
      const { xp, guild_id: guildID, id, xp_rank: rank, total_users: totalUsers } = data
      this.guildUser = {
        id, guildID, xp, rank, totalUsers
      }
      this.fetchedGuild = true
      return this
    } else { return this }
  }

  async save () {
    if (this.fetchedGlobal) {
      const json = JSON.stringify({
        id: this.userID,
        xp: this.globalUser.xp
      })
      await httpRequestHandler.post(`${process.env.DB_API_URL}/users/${this.userID}/xp`, json, {
        headers:
        {
          authorization:
          process.env.DB_API_AUTH,
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e.response.data))
    }

    if (this.fetchedGuild) {
      const json = JSON.stringify({
        id: this.userID,
        guild_id: this.guildID,
        xp: this.guildUser.xp
      })
      await httpRequestHandler.post(`${process.env.DB_API_URL}/guild/${this.guildID}/user/${this.userID}/xp`, json, {
        headers:
        {
          authorization:
          process.env.DB_API_AUTH,
          'Content-Type': 'application/json'
        }
      }).catch(e => console.log(e.response.data))
    }

    if (!this.fetchedGuild && !this.fetchedGlobal) {
      throw Error('Cant save before fetching.')
    }

    return this
  }
}

module.exports = LevellingDB
