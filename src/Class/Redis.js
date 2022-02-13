const redis = require('redis')
const { promisify } = require('util')

class Redis {
  /**
   * @param {String} name
   * @param {Number} db
   * @param {Object} config
   * @param {String} config.host
   * @param {Number} config.port
   * @param {String} config.auth
   */
  constructor (name, db, config = { host: '', port: 6379, auth: '' }) {
    this.name = name
    const commandArray = ['get', 'set', 'del', 'ttl', 'scan', 'keys']
    this.connection = redis.createClient({
      db: db,
      port: config.port,
      host: config.host,
      password: config.auth
    }).on('ready', () => {
      process.send ? process.send(`Redis has connected [${this.name}]`) : console.log(`Redis has connected [${this.name}]`)
    }).on('error', (err) => {
      process.send ? process.send(`Redis has encountered an error:\n${err}`) : console.log(`Redis has encountered an error:\n${err}`)
    })
    commandArray.forEach(command => {
      this[command] = promisify(this.connection[command]).bind(this.connection)
    })
  }

  async getAllKeys (pattern) {
    let cursor = '0'
    const keys = []
    do {
      const results = await this.scan(cursor, 'MATCH', pattern)
      console.log(results)
      cursor = results[0]
      keys.push(...results[1])
    } while (cursor !== '0')
    return keys
  }
}

module.exports = Redis
