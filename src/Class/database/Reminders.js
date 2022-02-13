const { default: axios } = require('axios')

class Reminders {
  async get () {
    return (await axios.get(`${process.env.DB_API_URL}/reminders`, { headers: { authorization: process.env.DB_API_AUTH } }))?.data || []
  }

  async add (options = {
    message: '',
    id: '',
    channelid: '',
    messagelink: '',
    remindertime: ''
  }) {
    const json = JSON.stringify(options)
    return (await axios.post(`${process.env.DB_API_URL}/reminders`, json, { headers: { authorization: process.env.DB_API_AUTH, 'Content-Type': 'application/json' } }))?.data
  }
}

module.exports = Reminders
