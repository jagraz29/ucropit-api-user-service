import ServiceBase from './common/ServiceBase'
import { defaultLanguageConfig } from '../utils'
const geocodingApi = process.env.GOOGLE_API_GEOCODING
const apiKey = process.env.GOOGLE_API_KEY

class GeoLocationService extends ServiceBase {
  public static getLocationByCoordinates(lat, long, language?, region?) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        `${geocodingApi}?latlng=${lat},${long}&language=${
          language || defaultLanguageConfig.language
        }&region=${region || defaultLanguageConfig.region}&key=${apiKey}`,
        {},
        (result) => {
          resolve(result.data.results)
        },
        (error) => reject(error)
      )
    })
  }
}

export default GeoLocationService
