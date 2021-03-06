const BitField = require('./BitField')

class UserFlags extends BitField {}

UserFlags.FLAGS = {
  DISCORD_EMPLOYEE: 1 << 0,
  PARTNERED_SERVER_OWNER: 1 << 1,
  HYPESQUAD_EVENTS: 1 << 2,
  BUGHUNTER_LEVEL_1: 1 << 3,
  HOUSE_BRAVERY: 1 << 6,
  HOUSE_BRILLIANCE: 1 << 7,
  HOUSE_BALANCE: 1 << 8,
  EARLY_SUPPORTER: 1 << 9,
  TEAM_USER: 1 << 10,
  BUGHUNTER_LEVEL_2: 1 << 14,
  VERIFIED_BOT: 1 << 16,
  EARLY_VERIFIED_BOT_DEVELOPER: 1 << 17,
  DISCORD_CERTIFIED_MODERATOR: 1 << 18
}

UserFlags.EMOTES = {
  DISCORD_EMPLOYEE: '<:discorddeveloper:910209578204024892>',
  PARTNERED_SERVER_OWNER: '<:partnered:910209578233380884>',
  HYPESQUAD_EVENTS: '<:hypesquadeventsv1:910209578170478603>',
  BUGHUNTER_LEVEL_1: '<:bughunter:910209578170478602>',
  HOUSE_BRAVERY: '<:bravery:910209578170449960>',
  HOUSE_BRILLIANCE: '<:brilliance:910209578183065620> ',
  HOUSE_BALANCE: '<:balance:910209578191454219>',
  EARLY_SUPPORTER: '<:earlysupporter:910209578132725841>',
  BUGHUNTER_LEVEL_2: '<:goldbughunter:910209578237558845>',
  VERIFIED_BOT: '<:verifiedbot1:910210802173247579><:verifiedbot2:910210802148077578>',
  EARLY_VERIFIED_BOT_DEVELOPER: '<:earlyverifieddeveloper:910209578187255898>',
  DISCORD_CERTIFIED_MODERATOR: '<:certifiedmod:910209578191454218>'
}

UserFlags.STRINGS = {
  DISCORD_EMPLOYEE: 'Discord Employee',
  PARTNERED_SERVER_OWNER: 'Discord Partner',
  HYPESQUAD_EVENTS: 'Hypesquad Event',
  BUGHUNTER_LEVEL_1: 'Bug Hunter',
  HOUSE_BRAVERY: 'House of Bravery',
  HOUSE_BRILLIANCE: 'House of Brilliance',
  HOUSE_BALANCE: 'House of Balance',
  EARLY_SUPPORTER: 'Early Supporter',
  BUGHUNTER_LEVEL_2: 'Golden Bug Hunter',
  VERIFIED_BOT: 'Verified Bot',
  EARLY_VERIFIED_BOT_DEVELOPER: 'Earily Verified Developer',
  DISCORD_CERTIFIED_MODERATOR: 'Certified Moderator'
}

class Intents extends BitField {}

/*
<:yes:913396896213659678>
<:no:913396896201056287>
<:maybe:913396896201056286>
 */

Intents.FLAGS = {
  GATEWAY_PRESENCE: 1 << 12,
  GATEWAY_PRESENCE_LIMITED: 1 << 13,
  GATEWAY_GUILD_MEMBERS: 1 << 14,
  GATEWAY_GUILD_MEMBERS_LIMITED: 1 << 15,
  VERIFICATION_PENDING_GUILD_LIMIT: 1 << 16,
  GATEWAY_MESSAGE_CONTENT: 1 << 18,
  GATEWAY_MESSAGE_CONTENT_LIMITED: 1 << 19
}

module.exports = {
  UserFlags,
  Intents
}
