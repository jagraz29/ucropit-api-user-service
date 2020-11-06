import ServiceBase from './common/ServiceBase'
const geocodingApi = process.env.GOOGLE_API_GEOCODING
const apiKey = process.env.GOOGLE_API_KEY

class GeoLocationService extends ServiceBase {
  public static getLocationByCoordinates (lat, long) {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        `${geocodingApi}?latlng=${lat},${long}&key=${apiKey}`,
        {},
        (result) => resolve(result.data.results)
      )
    })
  }
}

export default GeoLocationService
