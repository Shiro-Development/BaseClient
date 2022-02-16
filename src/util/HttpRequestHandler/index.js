const nodefetch = require('node-fetch')

module.exports = {}

const methods = ['GET', 'POST', 'PATCH', 'PUT', 'DELETE']
for (const method of methods) {
  module.exports[method.toLowerCase()] = async (url, body, options) => {
    const reqOptions = {
      method,
      headers: options?.headers
    }
    if (body) reqOptions.body = body
    const res = await nodefetch(url, reqOptions)
    let responseBody
    try {
      responseBody = await res.json()
    } catch {
      responseBody = res.body
    }
    return {
      _request: res,
      data: responseBody
    }
  }
}
