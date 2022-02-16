
// Discord API constants
const discordAPIVersion = 'v9'

exports.discord = {
  interactionTypes: {
    APPLICATION_COMMAND: 2
  },
  api: `${process.env?.DISCORD_API_HOST || 'https://discord.com'}/api/${discordAPIVersion}`,
  gateway: `${process.env?.DISCORD_API_HOST || 'https://discord.com'}/api/${discordAPIVersion}/gateway/bot`,
  channels: `${process.env?.DISCORD_API_HOST || 'https://discord.com'}/api/${discordAPIVersion}/channels/`,
  interactions: `${process.env?.DISCORD_API_HOST || 'https://discord.com'}/api/${discordAPIVersion}/interactions/`,
  webhooks: `${process.env?.DISCORD_API_HOST || 'https://discord.com'}/api/${discordAPIVersion}/webhooks/`,
  cdn: 'https://cdn.discordapp.com/'
}

exports.AUDIT_LOG_TYPES = {
  GUILD_UPDATE: 1,
  CHANNEL_CREATE: 10,
  CHANNEL_UPDATE: 11,
  CHANNEL_DELETE: 12,
  CHANNEL_OVERWRITE_CREATE: 13,
  CHANNEL_OVERWRITE_UPDATE: 14,
  CHANNEL_OVERWRITE_DELETE: 15,
  MEMBER_KICK: 20,
  MEMBER_PRUNE: 21,
  MEMBER_BAN_ADD: 22,
  MEMBER_BAN_REMOVE: 23,
  MEMBER_UPDATE: 24,
  MEMBER_ROLE_UPDATE: 25,
  MEMBER_MOVE: 26,
  MEMBER_DISCONNECT: 27,
  BOT_ADD: 28,
  ROLE_CREATE: 30,
  ROLE_UPDATE: 31,
  ROLE_DELETE: 32,
  INVITE_CREATE: 40,
  INVITE_UPDATE: 41,
  INVITE_DELETE: 42,
  WEBHOOK_CREATE: 50,
  WEBHOOK_UPDATE: 51,
  WEBHOOK_DELETE: 52,
  EMOJI_CREATE: 60,
  EMOJI_UPDATE: 61,
  EMOJI_DELETE: 62,
  MESSAGE_DELETE: 72,
  MESSAGE_BULK_DELETE: 73,
  MESSAGE_PIN: 74,
  MESSAGE_UNPIN: 75,
  INTEGRATION_CREATE: 80,
  INTEGRATION_UPDATE: 81,
  INTEGRATION_DELETE: 82,
  STAGE_INSTANCE_CREATE: 83,
  STAGE_INSTANCE_UPDATE: 84,
  STAGE_INSTANCE_DELETE: 85,
  STICKER_CREATE: 90,
  STICKER_UPDATE: 91,
  STICKER_DELETE: 92,
  GUILD_SCHEDULED_EVENT_CREATE: 100,
  GUILD_SCHEDULED_EVENT_UPDATE: 101,
  GUILD_SCHEDULED_EVENT_DELETE: 102,
  THREAD_CREATE: 110,
  THREAD_UPDATE: 111,
  THREAD_DELETE: 112
}
