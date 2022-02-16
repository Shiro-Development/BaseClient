const { httpRequestHandler } = require('../../util')

class Reminders {
  async get () {
    return (await httpRequestHandler.get(`${process.env.DB_API_URL}/reminders`, { headers: { authorization: process.env.DB_API_AUTH } }))?.data || []
  }

  async add (options = {
    message: '',
    id: '',
    channelid: '',
    messagelink: '',
    remindertime: ''
  }) {
    const json = JSON.stringify(options)
    return (await httpRequestHandler.post(`${process.env.DB_API_URL}/reminders`, json, { headers: { authorization: process.env.DB_API_AUTH, 'Content-Type': 'application/json' } }))?.data
  }
}

module.exports = Reminders
