import { Request, Response } from 'express'
import { StatusCodes } from 'http-status-codes'
import models from '../models'
import { ActivityTypeDocument } from '../models/activityType'
import { TypeAgreementDocument } from '../models/typeAgreement'
import { CountryRepository } from '../repositories'
import { getCropTypesUseCase } from '../core/cropTypes/useCase'
import { getStorageTypesUseCase } from '../core/typeStorages/useCase'
import { getUnitTypesUseCase } from '../core/unitTypes/useCase'
import { CropTypeDocument } from '../models/cropType'
import { TypeStorageDocument } from '../models/typeStorage'
import { UnitTypeDocument } from '../models/unitType'
import { EvidenceConceptDocument } from '../models/evidenceConcept'
import { RolesDocument } from '../models/Roles'
import { parseLangLocal } from '../utils/Locales'
import {
  activityTypeRepository,
  TypeAgreementRepository,
  EvidenceConceptRepository,
  RolesRepository
} from '../repositories'

const ServiceIntegrations = models.ServiceIntegration

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
    const results = await getCropTypesUseCase.execute({})
    const cropTypesKeys = req.__('crop_types.keys') as unknown as object
    const cropTypes = results.map((cropType: CropTypeDocument) => {
      const altLabel = cropType?.name?.es || cropType.key
      return {
        ...cropType,
        keyLabel: parseLangLocal(cropTypesKeys, cropType.key, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(cropTypes)
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
    const results = await getUnitTypesUseCase.execute({})
    const unitTypesKeys = req.__('unit_types.keys') as unknown as object
    const unitTypes = results.map((unitType: UnitTypeDocument) => {
      const altLabel = unitType?.name?.es || unitType.key
      return {
        ...unitType,
        keyLabel: parseLangLocal(unitTypesKeys, unitType.key, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(unitTypes)
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
    const result: ActivityTypeDocument[] = await activityTypeRepository.getAll()
    const activityTypesKeys = req.__('activity_types.tag') as unknown as object

    const activitiesTypes = result.map((activityType: ActivityTypeDocument) => {
      const altLabel = activityType?.name?.es || activityType?.tag
      return {
        ...activityType,
        keyLabel: parseLangLocal(activityTypesKeys, activityType.tag, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(activitiesTypes)
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
    const result: TypeAgreementDocument[] =
      await TypeAgreementRepository.getAll()

    const agreementTypesKeys = req.__('type_agreement.key') as unknown as object

    const agreementTypes = result.map(
      (typeAgreement: TypeAgreementDocument) => {
        const altLabel = typeAgreement?.name?.es || typeAgreement?.key
        return {
          ...typeAgreement,
          keyLabel: parseLangLocal(
            agreementTypesKeys,
            typeAgreement.key,
            altLabel
          )
        }
      }
    )

    res.status(StatusCodes.OK).json(agreementTypes)
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
    const result: EvidenceConceptDocument[] = (
      await EvidenceConceptRepository.getAll()
    ).filter((evidence) => evidence.code !== '0009')

    const evidenceConceptKeys = req.__(
      'evidence_concepts.code'
    ) as unknown as object

    const evidenceConcepts = result.map(
      (evidenceConcept: EvidenceConceptDocument) => {
        const altLabel = evidenceConcept?.name?.es || evidenceConcept?.code
        return {
          ...evidenceConcept,
          keyLabel: parseLangLocal(
            evidenceConceptKeys,
            evidenceConcept.code,
            altLabel
          )
        }
      }
    )

    res.status(StatusCodes.OK).json(evidenceConcepts)
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
    const result: RolesDocument[] = await RolesRepository.getAll()

    const rolesKeys = req.__('roles.value') as unknown as object

    const roles = result.map((role: RolesDocument) => {
      const altLabel = role?.label?.es || role?.value
      return {
        ...role,
        keyLabel: parseLangLocal(rolesKeys, role.value, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(roles)
  }

  /**
   * Get all services integrations
   *
   * @param Request req
   * @param Response res
   */
  public async serviceIntegration(req: Request, res: Response) {
    const services = await ServiceIntegrations.find({})

    res.status(StatusCodes.OK).json(services)
  }

  /**
   * Get all storage types
   *
   * @param Request req
   * @param Response res
   */
  public async storageTypes(req: Request, res: Response) {
    const results = await getStorageTypesUseCase.execute({})
    const storageTypeKeys = req.__('type_storages.keys') as unknown as object
    const storageTypes = results.map((storageType: TypeStorageDocument) => {
      const altLabel = storageType?.name?.es || storageType.key
      return {
        ...storageType,
        keyLabel: parseLangLocal(storageTypeKeys, storageType.key, altLabel)
      }
    })

    res.status(StatusCodes.OK).json(storageTypes)
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
        disabled: false
      }
    }

    const countries = await CountryRepository.getCountries(dataToFind)

    res.status(StatusCodes.OK).json(countries)
  }
}

export default new CommonController()
