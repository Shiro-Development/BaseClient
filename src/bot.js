const client = require('./Client')
const chalk = require('chalk')
const { Mutes } = require('./Class/database')

client.on('ready', async _ => {
  process.send ? process.send(`${chalk.yellowBright('[ CLIENT AMQ ]')} Connected to AMQP!`) : console.log(`${chalk.yellowBright('[ CLIENT AMQ ]')} Connected to AMQP!`)

  setInterval(async _ => {
    let { mutes } = await (new Mutes()).fetchAll()
    mutes = mutes.filter(m => !m.permanent)
    mutes = mutes.filter(m => Date.now() >= new Date(m.unmute_at).getTime())

    mutes.forEach(async m => {
      const shardID = parseInt((BigInt(m.guild_id) >> 22n) % BigInt(process.env.SHARD_COUNT))

      const guild = await client.cache.getGuild(shardID, m.guild_id)
      await guild.settings.fetch()
      if (!guild.settings.mod_log_enabled) return
      if (!guild.settings.mod_log_channel) return

      const moderator = await client.cache.getUser(shardID, process.env.BOT_ID)
      const target = await client.cache.getUser(shardID, m.user_id)

      const channel = await client.cache.getChannel(shardID, guild.settings.mod_log_channel, m.guild_id)

      const modLogCountCache = await client.redis.get(`${process.env.REDIS_TAG}:${guild.id}:modlogs:count`) || 0
      const modLogCount = modLogCountCache ? parseInt(modLogCountCache) : await guild.getModLogsCount()
      await client.redis.set(`${process.env.REDIS_TAG}:guilds:${guild.id}:modlogs:count`, modLogCount + 1)

      const modLogMsg = await guild.modlogs.sendModlog(channel, {
        actionType: 'Unmute',
        caseID: modLogCount + 1,
        user: target,
        moderator: moderator,
        reason: `Time's up (Case #${m.case_id})`
      })
      await guild.setModlog({
        case_id: modLogCount + 1,
        message_id: modLogMsg.id,
        reason: `Time's up (Case #${m.case_id})`,
        moderator: moderator.id,
        target: m.user_id,
        action: 'UNMUTE'
      })

      const member = await client.cache.getMember(shardID, m.user_id, guild.id)
      if (member.id) {
        if (guild.settings.mute_role) await member.removeRole(guild.settings.mute_role).catch(_ => _)
        else {
          const roles = await client.cache.getGuildRoles(shardID, guild.id)
          const role = roles.find(r => r.name.toLowerCase() === 'muted')
          if (role) await member.removeRole(role.id).catch(_ => _)
        }
      }

      await (new Mutes(client, guild.id)).remove(m.case_id)
    })
  }, 5000)
})
