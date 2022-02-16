const { httpRequestHandler } = require('../../util')
const { constants } = require('../../util')
const Permissions = require('../../util/Permissions')

class Member {
  constructor (client, member) {
    this.client = client
    this.id = member?.id
    this.guildID = member?.guildID
    this.roles = member?.roles || []
    this.nickname = member?.nickname
    this.joinedAt = member?.joined_at ? new Date(member?.joined_at) : member?.joinedAt ? new Date(member?.joinedAt) : undefined
    this.premiumSince = member?.premium_since
    this.deaf = member?.deaf
    this.mute = member?.mute
    this.pending = member?.pending
    this.avatar = member?.avatar
    this.permissions = null
    this._raw = member
  }

  async removeRole (role) {
    await httpRequestHandler.delete(`${constants.discord.api}/guilds/${this.guildID}/members/${this.id}/roles/${role}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async addRole (role) {
    await httpRequestHandler.put(`${constants.discord.api}/guilds/${this.guildID}/members/${this.id}/roles/${role}`, {}, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    })
  }

  async getPermissions () {
    let guildRoles = await this.client.cache.getGuildRoles(parseInt((BigInt(this.guildID) >> 22n) % BigInt(process.env.SHARD_COUNT)), this.guildID)
    guildRoles = guildRoles.filter(r => this.roles.includes(r.id) || r.name === '@everyone')
    guildRoles = guildRoles.map(r => { return { ...r, permissions: new Permissions(r.permissions) } })
    const permissions = {}
    guildRoles.forEach(r => {
      const rolePerms = r.permissions.serialize()
      Object.keys(rolePerms).forEach(k => {
        if (!permissions[k] || permissions[k] === false) permissions[k] = rolePerms[k]
      })
    })
    const highestRole = guildRoles.sort((a, b) => b.position - a.position)?.[0]
    this.permissions = {
      highestRole: highestRole || undefined,
      permissions: permissions || {}
    }
    return this
  }
}

module.exports = Member
