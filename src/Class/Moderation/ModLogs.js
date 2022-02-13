const { constants } = require('../../util')

class ModLogs {
  /**
   * Modlog handler for a guild
   * @param {Guild} guild
   */
  constructor (client, guild) {
    this.client = client
    this.guild = guild
    this.actionTypeColors = {
      Kick: 'yellow',
      Mute: 'yellow',
      Ban: 'red',
      Unban: 'green',
      Unmute: 'green'
    }
  }

  async sendModlog (channel, modlog = {
    actionType: '',
    caseID: undefined,
    user: undefined,
    moderator: undefined,
    reason: undefined
  }) {
    await this.guild.settings.fetch()
    return channel.send({
      embed: {
        color: constants.colors[this.actionTypeColors[modlog.actionType]],
        title: `${modlog.actionType} | Case #${modlog.caseID}`,
        fields: [
          {
            name: 'User',
            value: `${modlog.user.username}#${modlog.user.discriminator} (<@${modlog.user.id}>)`,
            inline: true
          },
          {
            name: 'Moderator',
            value: `${modlog.moderator.username}#${modlog.moderator.discriminator} (<@${modlog.moderator.id}>)`,
            inline: true
          },
          {
            name: 'Reason',
            value: modlog.reason || `Reason not provided. Please do \`${this.guild.settings.serverprefix}reason ${modlog.caseID} [reason]\``
          }
        ]
      }
    }).catch(_ => _)
  }
}

module.exports = ModLogs
