import models from '../models'

const { EvidenceConcept } = models

class CommonRepository {
  /**
   *
   * @param query
   *
   * @returns
   */
  public static findEvidenceConceptBy(query) {
    return EvidenceConcept.find(query)
  }
}
export default CommonRepository
