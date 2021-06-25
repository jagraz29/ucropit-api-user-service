import ServiceBase from './common/ServiceBase'
const countriesApi = process.env.COUNTRIES_API

export default class CountriesService extends ServiceBase {
  public static getCountries() {
    return new Promise((resolve, reject) => {
      this.makeRequest(
        'get',
        countriesApi,
        {},
        (result) => resolve(result.data),
        (error) => reject(error)
      )
    })
  }
}
