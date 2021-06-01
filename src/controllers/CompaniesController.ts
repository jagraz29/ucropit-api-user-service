import {Request, Response} from 'express'
import {flatten, map} from 'lodash'
import models from '../models'

import {
    validateCompanyStore,
    validateCompanyUpdate,
    validateFilesWithEvidences
} from '../utils/Validation'
import {getPathFileByType, getFullPath} from '../utils/Files'

import CompanyService from '../services/CompanyService'
import {ErrorResponseInstance} from '../utils'
import ErrorResponse from '../utils/ErrorResponse'
import CropService from '../services/CropService'
import LotService from '../services/LotService'
import Pagination from '../utils/Pagination'
import moment from 'moment'

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
        const {query} = req

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
        const company = await Company.findById(req.params.id)

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
        const {id} = req.params
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
    public async removeFile(req: Request, res: Response) {
        const {id, fileId} = req.params

        const company = await Company.findOne({_id: id})
        const document = await FileDocument.findOne({_id: fileId})

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
                .json({error: true, message: 'Not Found File to delete'})
        }

        res.status(200).json({
            message: 'deleted file successfully'
        })
    }

    public async findLotsByCompany (req: Request, res: Response) {
        let count = 0

        const { id } = req.params
        const { page = 1, limit = 20, dateCrop, dateHarvest } = req.query

        const pagination = new Pagination(parseInt(page.toString(), 10), parseInt(limit.toString(), 10))

        const companyInstance = await CompanyService.findById(id)
        if (!companyInstance) return res.status(ErrorResponseInstance.parseStatusCode(404)).json(ErrorResponseInstance.parseError(ErrorResponse.DATA_NOT_FOUND, 'La Empresa no existe'))

        let query = {
            identifier: companyInstance.identifier
        }

        // @ts-ignore
        if (dateCrop && moment.invalid(dateCrop)) {
            // @ts-ignore
            query['dateCrop'] = { $gte: new Date(dateCrop) }
        }

        // @ts-ignore
        if (dateHarvest && moment.invalid(dateHarvest)) {
            // @ts-ignore
            query['dateCrop'] = { $lte: new Date(dateHarvest) }
        }

        const cropsList = await CropService.findCropsWithLotsSample(query)

        if (cropsList.length === 0) {
            return res.status(ErrorResponseInstance.parseStatusCode(404)).json(ErrorResponseInstance.parseError(ErrorResponse.DATA_NOT_FOUND, 'No tiene cultivos asociados'))
        }

        const lotsInCrops = flatten(map(cropsList, 'lots'))
        const lotsInCropsIds = flatten(map(lotsInCrops, 'data'))
        // @ts-ignore
        query = {}
        query['_id'] = { $in: lotsInCropsIds }

        let results = []
        const lotsList: any[] = await LotService.search(query, pagination.limit, pagination.skip)

        if (lotsList.length > 0) {
            count = await LotService.count(query)
            results = LotService.parseLotWithTag(lotsList, lotsInCrops)
        }

        res.json({
            pagination: pagination.calculate(count),
            results,
        })
    }
}

export default new CompaniesController()
