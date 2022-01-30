class Role {
  constructor (client, role) {
    this.id = role.id
    this.guild_id = role.guild_id
    this.name = role.name
    this.color = role.color
    this.hoist = role.hoist
    this.icon = role.icon
    this.unicode_emoji = role.unicode_emoji
    this.position = role.position
    this.permissions = role.permissions
    this.managed = role.managed
    this.mentionable = role.mentionable
  }
}

module.exports = Role
