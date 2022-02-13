const { EventEmitter } = require('events')

class GuildQueue extends EventEmitter {
  constructor (client, id) {
    super()
    this.client = client
    this.guildID = id
    this.current = null
    this.tracks = []
  }

  sanitizeTitle (title) {
    title = title.replace(/(\[|\()(.*?)(\]|\))|((lyrics?)|(video)|(karaoke))/gmi, '')
    return title
  }

  async fetch () {
    const currentQueueData = await this.client.redis.get(`${process.env.REDIS_TAG}:queue:${this.guildID}:current`)
    const queueData = await this.client.redis.get(`${process.env.REDIS_TAG}:queue:${this.guildID}`)
    if (currentQueueData) this.current = JSON.parse(currentQueueData)
    if (queueData) this.tracks = JSON.parse(queueData)
  }
}

module.exports = GuildQueue
