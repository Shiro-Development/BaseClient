module.exports = class SlashCommand {
  constructor (client) {
    this.client = client
    this.category = null
    /* Not implemented */
    this.guildLocked = false
    this.guildLockedIDs = []
  }

  /**
   * @returns Command information
   * @example
   *  get info () {
   *    return {
   *      name: 'example',
   *      description: 'example description',
   *      aliases: [],
   *      syntax: []
   *    }
   *  }
   */
  get info () {
    return {
      name: 'example',
      description: 'example description',
      aliases: [],
      syntax: []
    }
  }

  /**
   * Sets the category of the command
   * @param {*} category Set command category
   */
  setCategory (category) {
    this.category = category
  }

  /**
   * The function to run upon the command being executed
   * @param {Message} msg Message data
   * @param {Object[]} args Command Arguments
   */
  async run (msg, args) {
    throw Error('No command function given')
  }
}
