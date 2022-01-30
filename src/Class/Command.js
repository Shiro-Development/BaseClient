/**
 * Command class to define the based command
 */
class Command {
  /**
   * @param {Client} client Bots amqp client
   */
  constructor (client) {
    this.client = client
    this.category = null
    this.baseName = null
    this.baseDescription = null
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
   * Set the category of the command
   * @param {*} category
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

module.exports = Command
