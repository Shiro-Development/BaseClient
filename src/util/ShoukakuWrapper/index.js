/**
 * Shoukaku's Library Plugin
 * @class Wrapper
 */
class Wrapper {
  /**
   * @param {Client} client Library client
   */
  constructor (client) {
    /**
       * @type {Client}
       */
    this.client = client
  }

  /**
   * Getters for the library important things
   * @returns {Object}
   */
  getters () {
    return {
      // guild cache, must be a map or anything that extends from map
      guilds: { has () { return true } },
      // getter for user id
      id: () => process.env.BOT_ID,
      // websocket shard payload sender
      ws: null
    }
  }

  /**
   * Builds this library
   * @param {Shoukaku} shoukaku Your Shoukaku instance
   * @param {Object[]} nodes Array of Lavalink nodes to initially connect to
   * @param {string} nodes.name Lavalink node name
   * @param {string} nodes.url Lavalink node url without prefix like, ex: http://
   * @param {string} nodes.auth Lavalink node password
   * @param {boolean} [nodes.secure=false] Whether this node should be in secure wss or https mode
   * @param {string} [nodes.group] Lavalink node group
   * @returns {Object}
   */
  build (shoukaku, nodes) {
    if (!nodes?.length) throw new Error('No nodes supplied')
    // attach to ready event "once"
    this.client.once('ready', _ => shoukaku._clientReady(nodes))
    // attach to raw event
    // this.client.on('raw', packet => shoukaku._clientRaw(packet))
    // return the getters for Shoukaku's usage
    return this.getters()
  }
}

module.exports = Wrapper
