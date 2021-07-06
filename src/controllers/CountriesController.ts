import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import { CountryRepository } from '../repositories'

class CountriesController {
  /**
   *
   * Get all countries.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async index(req: Request | any, res: Response) {
    const dataToFind: any = {
      query: {
        disabled: false
      }
    }

    const countries = await CountryRepository.getCountries(dataToFind)

    res.status(StatusCodes.OK).json(countries)
  }
}

export default new CountriesController()
