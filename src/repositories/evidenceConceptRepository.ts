import models from '../models'
import { EvidenceConceptDocument } from '../models/evidenceConcept'

const { EvidenceConcept } = models

export class EvidenceConceptRepository {
  /**
   *
   * @returns
   */
  public static async getAll(): Promise<EvidenceConceptDocument[]> {
    return EvidenceConcept.find({}).lean()
  }
}
