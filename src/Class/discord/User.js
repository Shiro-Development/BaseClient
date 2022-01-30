const { default: axios } = require('axios')
const { Flags: { UserFlags }, constants: { discord } } = require('../../util')
const { DatabaseUser } = require('../database')
const Member = require('./Member')

/**
 * A discord user
 */
class User {
  /**
   * @param {Object} userObject
   * @param {String} userObject.id The user id snowflake
   * @param {String} userObject.username The username of the user
   * @param {String} userObject.discriminator The descriminator of the user
   * @param {String} userObject.avatar The avatar hash used for the user's current avatar
   * @param {BitFieldResolvable} userObject.public_flags The bitfield resolvable of the users public flags
   * @param {Object} userObject.member The guild member object of the user if user is in the guild
   */
  constructor (client, userObject) {
    const { id, username, discriminator, avatar, public_flags: publicFlags, member, bot } = userObject
    this.id = id
    this.bot = bot
    this.username = username
    this.discriminator = discriminator
    this.avatar = avatar
    this.flags = new UserFlags(publicFlags)
    this.member = new Member(client, member)
    this.databaseUser = new DatabaseUser(client, this.id)
    this.applicationInfo = undefined
  }

  async fetchApplicationRPC () {
    this.applicationInfo = (await axios.get(`${discord.api}/applications/${this.id}/rpc`).catch(_ => {}))?.data || undefined
    return this
  }
}

module.exports = User
