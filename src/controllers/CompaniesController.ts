import { Request, Response } from 'express'
import models from '../models'

import {
  validateCompanyStore,
  validateFilesWithEvidences
} from '../utils/Validation'
import { getPathFileByType, getFullPath } from '../utils/Files'

import CompanyService from '../services/CompanyService'

const Company = models.Company
const FileDocument = models.FileDocument

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
    const data = JSON.parse(req.body.data)

    await validateCompanyStore(data)
    const validationFiles = validateFilesWithEvidences(
      req.files,
      data.evidences
    )

    if (validationFiles.error) {
      res.status(400).json(validationFiles)
    }

    const companyIsExist = await CompanyService.search({ identifier : data.identifier })

    if (companyIsExist) {
      res.status(400).json('Already exist company with identifier')
    }

    let company = await CompanyService.store(
      data,
      req.files,
      data.evidences,
      user
    )

    company = await CompanyService.findById(company._id)

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

  /**
   * Delete File to company.
   *
   * @param req
   * @param res
   *
   * @return {Response}
   */
  public async removeFile (req: Request, res: Response) {
    const { id, fileId } = req.params

    const company = await Company.findOne({ _id: id })
    const document = await FileDocument.findOne({ _id: fileId })

    const fileRemove = await CompanyService.removeFiles(
      fileId,
      company,
      `${getFullPath(getPathFileByType('company'))}/${company.identifier}/${
        document.nameFile
      }`
    )

    if (!fileRemove) {
      return res
        .status(404)
        .json({ error: true, message: 'Not Found File to delete' })
    }

    res.status(200).json({
      message: 'deleted file successfully'
    })
  }
}

export default new CompaniesController()
