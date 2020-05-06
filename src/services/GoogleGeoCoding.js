'use strict'

const RequestPromise = require('../services/RequestPromise')
const geocodingApi = process.env.GOOGLE_API_GEOCODING
const apiKey = process.env.GOOGLE_API_KEY

class GoogleGeoCoding {
  static async getGeocoding(latitude, longitude) {
    try {
      const request = new RequestPromise(
        `${geocodingApi}?latlng=${latitude},${longitude}&key=${apiKey}`,
        'GET'
      )

      let result = await request.send()
      result = JSON.parse(result)

      return { error: false, data: result.results }
    } catch (error) {
      return { erro: true, data: null }
    }
  }
}

module.exports = GoogleGeoCoding
