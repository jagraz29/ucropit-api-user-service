require('dotenv').config()

import models, { connectDb } from '../models'
import chalk from 'chalk'
import {
  cropTypesData,
  unitTypesData,
  activitiesTypesData,
  agreementTypesData,
  supplyTypesData,
  evidenceConcepts,
  rolesData,
  servicesIntegration,
  storageTypes
} from './data'

import {
  suppliesData,
  fertilizers,
  pesticides,
  phytotherapeutic
} from './suppliesData'

import { activesPrinciples } from './activesPrinciplesData'

const CropType = models.CropType
const UnitType = models.UnitType
const ActivityType = models.ActivityType
const TypeAgreement = models.TypeAgreement
const SupplyType = models.SupplyType
const Supply = models.Supply
const EvidenceConcept = models.EvidenceConcept
const Roles = models.Roles
const ServiceIntegration = models.ServiceIntegration

const CollaboratorRequest = models.CollaboratorRequest
const TypeStorage = models.TypeStorage
const ActivePrinciple = models.ActivePrinciple

/**
 * Seeders CropType
 */
const seedersCropType = async (flag?) => {
  if (flag && flag !== '--cropType') return
  console.log(`${chalk.green('=====Registering CropTypes====')}`)

  const cropTypes = await CropType.find({})

  const cropTypesSeed = cropTypesData.filter(
    (item) => !cropTypes.find((element) => item.key === element.key)
  )

  for (const cropType of cropTypesSeed) {
    await CropType.create(cropType)
  }
  console.log(`${chalk.green('=====Registered CropTypes====')}`)
  return true
}

/**
 * Seeder UnitType
 */
const seedersUnitType = async (flag?) => {
  if (flag && flag !== '--unitType') return
  console.log(`${chalk.green('=====Registering UnitType====')}`)

  const unitTypes = await UnitType.find({})

  const unitTypeSeed = unitTypesData.filter(
    (item) => !unitTypes.find((element) => item.key === element.key)
  )

  for (const unitType of unitTypeSeed) {
    await UnitType.create(unitType)
  }

  console.log(`${chalk.green('=====Registered UnitType====')}`)
  return true
}

const seedersActivitiesType = async (flag?) => {
  if (flag && flag !== '--activityType') return
  console.log(`${chalk.green('=====Registering ActivityType====')}`)

  const activities = await ActivityType.find({})

  const activityTypeSeed = activitiesTypesData.filter(
    (item) => !activities.find((element) => item.tag === element.tag)
  )

  for (const activityType of activityTypeSeed) {
    await ActivityType.create(activityType)
  }

  console.log(`${chalk.green('=====Registered ActivityType====')}`)
  return true
}

const seedersTypeAgreement = async (flag) => {
  if (flag && flag !== '--typeAgreement') return
  console.log(`${chalk.green('=====Registering TypeAgreement====')}`)

  const agreementTypes = await TypeAgreement.find({})

  const agreementTypeSeed = agreementTypesData.filter(
    (item) => !agreementTypes.find((element) => item.key === element.key)
  )

  for (const agreementType of agreementTypeSeed) {
    await TypeAgreement.create(agreementType)
  }

  console.log(`${chalk.green('=====Registered TypeAgreement====')}`)
  return true
}

const dropAllDatabase = (connected) => {
  return connected.connection.db.dropDatabase()
}

const seedersSupply = async (flag?) => {
  if (flag && flag !== '--suppply') return
  console.log(`${chalk.green('=====Registering Supply====')}`)

  const supplies = await Supply.find({})

  const supplySeed = suppliesData.filter(
    (item) => !supplies.find((element) => item.name === element.name)
  )

  for (const supply of supplySeed) {
    await Supply.create(supply)
  }

  console.log(`${chalk.green('=====Registered Supply====')}`)
  return true
}

const seedersSupplyFertilizers = async (flag?) => {
  if (flag && flag !== '--fertilizers') return
  console.log(`${chalk.green('=====Registering Supply Fertilizers====')}`)
  const supplies = await Supply.find({})

  const supplyFertilizerSeed = fertilizers.filter(
    (item) => !supplies.find((element) => item.name === element.name)
  )

  for (const supplyType of supplyFertilizerSeed) {
    await Supply.create(supplyType)
  }

  console.log(`${chalk.green('=====Registered Supply Fertilizers ====')}`)
  return true
}

const seedersSupplyPesticides = async (flag?) => {
  if (flag && flag !== '--pesticides') return
  console.log(`${chalk.green('=====Registering Supply Pesticides====')}`)

  const supplies = await Supply.find({})

  const supplyPesticidesSeed = pesticides.filter(
    (item) => !supplies.find((element) => item.name === element.name)
  )

  for (const supplyType of supplyPesticidesSeed) {
    await Supply.create(supplyType)
  }
  console.log(`${chalk.green('=====Registered Supply Pesticides ====')}`)
  return true
}

const seedersSupplyPhytotherapeutic = async (flag?) => {
  if (flag && flag !== '--phytothera') return
  console.log(`${chalk.green('=====Registering Supply Phytotherapeutic====')}`)

  for (const supplyType of phytotherapeutic) {
    await Supply.create(supplyType)
  }

  console.log(`${chalk.green('=====Registered Supply Phytotherapeutic====')}`)

  return true
}

const seedersSupplyType = async (flag?) => {
  if (flag && flag !== '--supplyType') return
  console.log(`${chalk.green('=====Registering SupplyType====')}`)

  const supplies = await SupplyType.find({})
  const supplyTypeSeed = supplyTypesData.filter(
    (item) => !supplies.find((element) => item.name === element.name)
  )

  for (const supplyType of supplyTypeSeed) {
    await SupplyType.create(supplyType)
  }

  console.log(`${chalk.green('=====Registered SupplyType====')}`)
  return true
}

const seedersRoles = async (flag?) => {
  if (flag && flag !== '--roles') return
  console.log(`${chalk.green('=====Registering Roles====')}`)

  const role = await Roles.find({})
  const roleTypeSeed = rolesData.filter(
    (item) => !role.find((element) => item.value === element.value)
  )

  for (const roleType of roleTypeSeed) {
    await Roles.create(roleType)
  }

  console.log(`${chalk.green('=====Registered Roles====')}`)
  return true
}

const seedersEvidenceConcepts = async (flag?) => {
  if (flag && flag !== '--evidence') return

  console.log(`${chalk.green('=====Registering Evidence Concept====')}`)

  const evidences = await EvidenceConcept.find({})

  const evidencesConceptSeed = evidenceConcepts.filter(
    (item) => !evidences.find((element) => item.code === element.code)
  )

  for (const evidenceConcept of evidencesConceptSeed) {
    await EvidenceConcept.create(evidenceConcept)
  }

  console.log(`${chalk.green('=====Registered Evidence Concept====')}`)
  return true
}

const seedersServiceIntegrations = async (flag?) => {
  if (flag && flag !== '--integrations') return

  console.log(`${chalk.green('=====Registering Service Integrations====')}`)
  const services = await ServiceIntegration.find({})

  const servicesIntegrationSeed = servicesIntegration.filter(
    (item) => !services.find((element) => item.code === element.code)
  )

  for (const serviceIntegration of servicesIntegrationSeed) {
    await ServiceIntegration.create(serviceIntegration)
  }

  console.log(`${chalk.green('=====Registered Service Integrations ====')}`)
  return true
}

const seedersStorageTypes = async (flag?) => {
  if (flag && flag !== '--storage-types') return

  console.log(`${chalk.green('=====Registering Storage Types====')}`)
  const typesStorage = await TypeStorage.find({})

  const typesStorageSeed = storageTypes.filter(
    (item) => !typesStorage.find((element) => item.key === element.key)
  )

  for (const typeStorage of typesStorageSeed) {
    await TypeStorage.create(typeStorage)
  }

  console.log(`${chalk.green('=====Registered Storage Types ====')}`)
  return true
}

const seedersActivePrinciples = async (flag?) => {
  if (flag && flag !== '--active-principles') return

  console.log(`${chalk.green('=====Registering Actives Principles ====')}`)
  const activePrinciples = await ActivePrinciple.find({})

  const activesPrincipleSeed = activesPrinciples.filter(
    (item) =>
      !activePrinciples.find(
        (element) => element.name.es === item.active_principle_es
      )
  )

  for (const activePrinciple of activesPrincipleSeed) {
    await ActivePrinciple.create({
      name: {
        es: activePrinciple.active_principle_es
      },
      eiq: Number(activePrinciple.eiq.replace(/,/g, '.'))
    })
  }

  console.log(`${chalk.green('=====Registered Actives Principles ====')}`)
  return true
}

;(async () => {
  const connected = await connectDb()

  if (connected) {
    if (process.argv[2] && process.argv[2] === '--reset') {
      console.log(`${chalk.green('=====Clean all DataBase ====')}`)
      dropAllDatabase(connected)
      console.log(`${chalk.green('=====Reset DataBase ====')}`)
    }

    const flag = process.argv[2] === '--reset' ? null : process.argv[2] || null

    try {
      await seedersRoles(flag)
      await seedersSupply(flag)
      await seedersSupplyFertilizers(flag)
      await seedersSupplyPesticides(flag)
      await seedersSupplyPhytotherapeutic(flag)
      await seedersSupplyType(flag)
      await seedersUnitType(flag)
      await seedersCropType(flag)
      await seedersActivitiesType(flag)
      await seedersTypeAgreement(flag)
      await seedersEvidenceConcepts(flag)
      await seedersServiceIntegrations(flag)
      await seedersStorageTypes(flag)
      await seedersActivePrinciples(flag)
    } catch (e) {
      console.log(e)
    }
  }
  process.exit()
})()
