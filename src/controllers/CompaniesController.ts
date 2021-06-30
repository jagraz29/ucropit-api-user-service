import { Request, Response } from 'express'
import models from '../models'

import {
  validateCompanyStore,
  validateCompanyUpdate,
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
  public async index(req: Request, res: Response) {
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
  public async show(req: Request, res: Response) {
    const company = await Company.findById(req.params.id).populate('files')

    res.status(200).json(company)
  }

  /**
   * Show list integration services.
   *
   * @param Request req
   * @param Response res
   *
   * @return {Response}
   */
  public async showIntegrations(req: Request, res: Response) {
    const company: any = await Company.findById(req.params.id)

    res.status(200).json(company.servicesIntegrations)
  }

  /**
   * Create a Company.
   *
   * @param req
   * @param res
   *
   * @return {Response}
   */
  public async create(req, res: Response) {
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

    const companyIsExist = await CompanyService.search({
      identifier: data.identifier
    })

    if (companyIsExist.length > 0) {
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
  public async update(req: Request, res: Response) {
    const user = req.user
    const { id } = req.params
    const data = JSON.parse(req.body.data)

    await validateCompanyUpdate(data)

    if (req.files) {
      const validationFiles = validateFilesWithEvidences(
        req.files,
        data.evidences
      )

      if (validationFiles.error) {
        res.status(400).json(validationFiles)
      }
    }

    let company = await CompanyService.updated(data, id)

    if (req.files) {
      company = await CompanyService.addFiles(
        company,
        data.evidences,
        req.files,
        user,
        `companies/${company.identifier}`
      )
    }
    res.status(200).json(company)
  }

  /**
   *
   * @param req
   * @param res
   *
   * @return {Response}
   */
  public async delete(req: Request, res: Response) {
    await Company.findByIdAndDelete(req.params.id)

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
  public async removeFile(req: Request, res: Response) {
    const { id, fileId } = req.params

    const company: any = await Company.findOne({ _id: id })
    const document: any = await FileDocument.findOne({ _id: fileId })

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
