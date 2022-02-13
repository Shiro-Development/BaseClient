const { default: axios } = require('axios')
const { constants } = require('../../util')
const { GuildSettings, Mutes } = require('../database')
const { ModLogs } = require('../Moderation')

function encodeQueryData (data) {
  const ret = []
  for (const d in data) {
    if (data[d]) {
      if (d === 'action_type') {
        ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(constants.AUDIT_LOG_TYPES[data[d]]))
      } else ret.push(encodeURIComponent(d) + '=' + encodeURIComponent(data[d]))
    }
  }
  return ret.join('&')
}

class Guild {
  /**
   * @param {Client} client The clients ampq connection
   * @param {Object} guild The guild object from the gateway
   */
  constructor (client, guild) {
    this.client = client
    this.id = guild.id
    this.name = guild.name
    this.icon = guild.icon
    this.splash = guild.splash
    this.discoverySplash = guild.discovery_splash
    this.ownerID = guild.owner_id
    this.afkChannelID = guild.afk_channel_id
    this.afkTimeout = guild.afk_timeout
    this.verificationLevel = guild.verification_level
    this.defaultMessageNotifications = guild.default_message_notifications
    this.explicitContentFilter = guild.explicit_content_filter
    this.features = guild.features
    this.mfaLevel = guild.mfa_level
    this.applicationID = guild.application_id
    this.systemChannelID = guild.system_channel_id
    this.systemChannelFlags = guild.system_channel_flags
    this.rulesChannelID = guild.rules_channel_id
    this.joinedAt = guild.joined_at
    this.large = guild.large
    this.unavailable = guild.unavailable
    this.memberCount = guild.member_count
    this.maxMembers = guild.max_members
    this.vanityUrlCode = guild.vanity_url_code
    this.description = guild.description
    this.banner = guild.banner
    this.premiumTier = guild.premium_tier
    this.premiumSubscriptionCount = guild.premium_subscription_count
    this.preferredLocale = guild.preferred_locale
    this.public_updatesChannelID = guild.public_updates_channel_id
    this.maxVideoChannelUsers = guild.max_video_channel_users
    this.nsfwLevel = guild.nsfw_level
    this.roles = guild.roles
    this.emojis = guild.emojis
    this.channels = guild.channels
    this.threads = guild.threads
    this.settings = new GuildSettings(this.client, guild.id)
    this.modlogs = new ModLogs(this.client, this)
    this.mutes = new Mutes(this.client, guild.id)
  }

  async kick (user, reason) {
    if (!user) return
    return axios.delete(`${constants.discord.api}/guilds/${this.id}/members/${user}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot',
        'X-Audit-Log-Reason': reason || ''
      }
    })
  }

  /**
   * Ban a user from the guild
   * @param {String} user
   * @param {String|null} reason
   * @param {Object{}} options
   * @param {Number} options.delete_message_days
   * @returns
   */
  async ban (user, reason, options = { delete_message_days: 0 }) {
    if (!user) return
    const json = JSON.stringify(options)
    return axios.put(`${constants.discord.api}/guilds/${this.id}/bans/${user}`, json, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot',
        'X-Audit-Log-Reason': reason || ''
      }
    })
  }

  async unban (user, reason) {
    if (!user) return
    return axios.delete(`${constants.discord.api}/guilds/${this.id}/bans/${user}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot',
        'X-Audit-Log-Reason': reason || ''
      }
    })
  }

  async fetchAuditLog (options = { limit: 50, action_type: undefined, user_id: undefined, before: undefined }) {
    return (await axios.get(`${constants.discord.api}/guilds/${this.id || ''}/audit-logs?${encodeQueryData(options)}`, {
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        'User-Agent': 'Discord-bot'
      }
    }).catch(_ => _)).data
  }

  async getModLogsCount () {
    return (await axios.get(`${process.env.DB_API_URL}/guild/${this.id || ''}/modlogs/count`,
      { headers: { authorization: process.env.DB_API_AUTH } })).data.count
  }

  async getModlogs () {
    return (await axios.get(`${process.env.DB_API_URL}/guild/${this.id || ''}/modlogs`,
      { headers: { authorization: process.env.DB_API_AUTH } })).data
  }

  async setModlog (options = {
    case_id: undefined,
    message_id: '',
    reason: '',
    moderator: '',
    target: '',
    action: ''
  }) {
    const json = JSON.stringify({
      guild_id: this.id,
      ...options
    })
    return await axios.post(`${process.env.DB_API_URL}/guild/${this.id || ''}/modlogs`, json,
      {
        headers: {
          'Content-Type': 'application/json',
          authorization: process.env.DB_API_AUTH
        }
      }).catch(e => console.log(e.response))
  }
}

module.exports = Guild
