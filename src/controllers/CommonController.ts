import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import models from '../models'
import { CountryRepository } from '../repositories'

const CropType = models.CropType
const UnitType = models.UnitType
const ActivityType = models.ActivityType
const TypeAgreement = models.TypeAgreement
const EvidenceConcepts = models.EvidenceConcept
const Roles = models.Roles
const ServiceIntegrations = models.ServiceIntegration
const TypeStorage = models.TypeStorage

class CommonController {
  /**
   *
   * Get all crops types.
   *
   * @param  Request req
   * @param  Response res
   *
   * @return Response
   */
  public async cropTypes(req: Request, res: Response) {
    const cropTypes = await CropType.find({})

    res.status(200).json(cropTypes)
  }

  /**
   * Get all unit types
   *
   * @param req
   * @param res
   *
   *  @return Response
   */
  public async unitTypes(req: Request, res: Response) {
    const unitTypes = await UnitType.find({})

    res.status(200).json(unitTypes)
  }

  /**
   *
   * Get all activities types
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async activitiesTypes(req: Request, res: Response) {
    const activitiesTypes = await ActivityType.find({})

    res.status(200).json(activitiesTypes)
  }

  /**
   *
   * Get all agreement types
   *
   * @param req
   * @param res
   *
   * @return Response
   */
  public async agreementTypes(req: Request, res: Response) {
    const agreementTypes = await TypeAgreement.find({})

    res.status(200).json(agreementTypes)
  }

  /**
   * Get all evidence concepts.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async evidenceConcepts(req: Request, res: Response) {
    const evidenceConceptsinstance: any = await EvidenceConcepts.find({})
    const evidenceConcepts = evidenceConceptsinstance.filter(
      (evidence) => evidence.code !== '0009'
    )

    res.status(200).json(evidenceConcepts)
  }

  /**
   * Get all collaborator roletypes
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async roles(req: Request, res: Response) {
    const roles = await Roles.find({})

    res.status(200).json(roles)
  }

  /**
   * Get all services integrations
   *
   * @param Request req
   * @param Response res
   */
  public async serviceIntegration(req: Request, res: Response) {
    const services = await ServiceIntegrations.find({})

    res.status(200).json(services)
  }

  /**
   * Get all storage types
   *
   * @param Request req
   * @param Response res
   */
  public async storageTypes(req: Request, res: Response) {
    const storageTypes = await TypeStorage.find({})

    res.status(200).json(storageTypes)
  }

  /**
   *
   * Get all countries availables.
   *
   * @param Request req
   * @param Response res
   *
   * @return Response
   */
  public async countries(req: Request | any, res: Response) {
    const dataToFind: any = {
      query: {
        disabled: false,
      },
    }

    const countries = await CountryRepository.getCountries(dataToFind)

    res.status(StatusCodes.OK).json(countries)
  }
}

export default new CommonController()
