/**
 * Event class for handling events recieved from the gateway
 * @param {String} info.eventName Event name
 * @param {Boolean} info.once Whether the event should only fire once
 */
class DiscordEvent {
  constructor () {
    this.info = {
      eventName: 'eventName',
      once: false
    }
  }

  /**
   * @public
   * @param {Object} commandOtions Command options passed by the handler
   * @param {Object} eventData Event passed by the handler
   * @param {Object} eventData.event Event data from within the messageData object
   * @param {String} eventData.event.d Raw event data
   * @param {String} eventData.event.t Raw event name
   * @param {String} eventData.shard_id ID the event was recieved from
   */
  handle (client, eventData) {}
}

module.exports = DiscordEvent
