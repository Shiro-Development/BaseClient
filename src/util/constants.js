
// Discord API constants
const discordAPIVersion = 'v8'

exports.discord = {
  interactionTypes: {
    APPLICATION_COMMAND: 2
  },
  api: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}`,
  gateway: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/gateway/bot`,
  channels: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/channels/`,
  interactions: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/interactions/`,
  webhooks: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/webhooks/`,
  cdn: 'https://cdn.discordapp.com/',
  globalCommands: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/applications/${process.env.BOT_ID}/commands`,
  privateCommands: `${process.env.DISCORD_API_HOST}/api/${discordAPIVersion}/applications/${process.env.BOT_ID}/guilds/817548193410580511/commands`
}

// shiro links
exports.shiro = {
  invite: 'https://discord.com/oauth2/authorize?client_id=461521980492087297&permissions=1476783326&redirect_uri=https%3A%2F%2Fshirobot.org%2Fauthorize&authorize&response_type=code&scope=bot+identify+guilds+applications.commands',
  website: 'https://shirobot.org/',
  emoji_links: {
    cross: 'https://cdn.discordapp.com/emojis/926180096006557776.png?size=128',
    blobban: 'https://cdn.discordapp.com/emojis/926186125289213993.gif?size=128',
    boot: 'https://cdn.discordapp.com/emojis/926245207509450833.png?size=128',
    yes: 'https://cdn.discordapp.com/emojis/913396896213659678.png?size=128'
  },
  emoji: {
    yes: '<:yes:913396896213659678>',
    no: '<:no:913396896201056287>',
    maybe: '<:maybe:913396896201056286>',
    cross: '<:crossmark:926180096006557776>',
    blobban: '<a:blobcatban:926186125289213993>'
  }
}

exports.colors = {
  discord: 3553599, // Discord
  green: 1482885, // Green
  red: 13718098, // red
  shiro: 14207883, // Yellow
  tan: 16763558, // Tan
  blue: 6921183, // Blue
  purple: 16741370, // Purple/boost
  yellow: 14724172 // Mute Yellow
}

exports.STRINGS = {
  imageCommand: {
    'images/avatars': '',
    'images/blush': 'Oh my! You made {user} blush!',
    'images/cry': 'Oh no! You made {user} cry!',
    'images/hug': 'You\'ve been hugged by {user}!',
    'images/kiss': 'You\'ve been kissed by {user}!',
    'images/lick': 'You\'ve been licked by {user}!',
    'images/neko': '',
    'images/nom': 'You\'ve been nommed on by {user}!',
    'images/pat': 'You\'ve been pat by {user}!',
    'images/poke': 'You\'ve been poked by {user}!',
    'images/pout': 'Oh no! You made {user} pout!',
    'images/punch': 'You\'ve been punched by {user}!',
    'images/slap': 'You\'ve been slapped by {user}!',
    'images/sleep': 'You sent {user} to sleep!',
    'images/smug': '',
    'images/tickle': 'You\'ve been tickled by {user}!',
    'images/trap': '',
    'images/wallpapers': ''
  }
}

exports.symbols = {
  DOUBLE_ARROW_RIGHT: '»'
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
