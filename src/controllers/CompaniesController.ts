import { Request, Response } from 'express'
import models from '../models'

import { validateCompanyStore } from '../utils/Validation'

const Company = models.Company

class CompaniesController {
  /**
   * Get all companies
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async index (req: Request, res: Response) {
    const companies = await Company.find({})

    res.status(200).json(companies)
  }

  /**
   *
   * Get one Company
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async show (req: Request, res: Response) {
    const company = await Company.findById(req.params.id)

    res.status(200).json(company)
  }

  /**
   * Create a Company.
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async create (req: Request, res: Response) {
    await validateCompanyStore(req.body)
    let company = await Company.create(req.body)

    res.status(201).json(company)
  }

  /**
   * Update de Company
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async update (req: Request, res: Response) {
    await Company.findByIdAndUpdate(req.params.id, req.body)
    const company = await Company.findById(req.params.id)

    res.status(200).json(company)
  }

  /**
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async delete (req: Request, res: Response) {
    const company = await Company.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }
}

export default new CompaniesController()
