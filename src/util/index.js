const { default: axios } = require('axios')
const Levelling = require('./Levelling')

module.exports = {
  Flags: require('./Flags'),
  constants: require('./constants'),

  // Convert snowflake into date
  // Converts discord ID snowflakes into join date
  convertSnowflakeToDate: (snowflake) => {
    const joinDate = new Date((snowflake / 4194304) + 1420074594304)
    return {
      date: joinDate,
      unix: Math.floor(joinDate.getTime() / 1000)
    }
  },

  convertAuditSnowflakeToDate: (snowflake) => {
    const joinDate = new Date((snowflake / 4194304) + 1420070394304)
    return {
      date: joinDate,
      unix: Math.floor(joinDate.getTime() / 1000)
    }
  },

  fetchShiroAPI: async (endpoint) => {
    return axios.get(`https://api.dbot.dev/${endpoint}`)
  },

  downloadImage: async (url) => {
    return axios.get(url, {
      responseType: 'arraybuffer'
    })
  },
  Levelling
}
