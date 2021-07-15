import ServiceBase from './common/ServiceBase'
const geocodingApi = process.env.GOOGLE_API_GEOCODING
const apiKey = process.env.GOOGLE_API_KEY

class GeoLocationService extends ServiceBase {
  public static getLocationByCoordinates(lat, long, language?, region?) {
    if (!language) language = 'es'
    if (!region) language = 'AR'
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        `${geocodingApi}?latlng=${lat},${long}&language=${language}&region=${region}&key=${apiKey}`,
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
