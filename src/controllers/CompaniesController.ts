import { Request, Response } from 'express'
import models from '../models'

import { validateCompanyStore } from '../utils/Validation'

import CompanyService from '../services/CompanyService'

const Company = models.Company

class CompaniesController {
  /**
   * Get all companies
   *
   * @param req
   * @param res
   *
   * @return {Response}
   */
  public async index (req: Request, res: Response) {
    const { query } = req

    const companies = await CompanyService.search(query)

    res.status(200).json(companies)
  }

  /**
   *
   * Get one Company
   *
   * @param req
   * @param res
   *
   * @return {Response}
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
   * @return {Response}
   */
  public async create (req, res: Response) {
    const user = req.user

    await validateCompanyStore(req.body)
    let company = await CompanyService.store(req.body, req.files, user)

    res.status(201).json(company)
  }

  /**
   * Update de Company
   *
   * @param req
   * @param res
   *
   * @return {Response}
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
   * @return {Response}
   */
  public async delete (req: Request, res: Response) {
    const company = await Company.findByIdAndDelete(req.params.id)

    res.status(200).json({
      message: 'deleted successfully'
    })
  }
}

export default new CompaniesController()
