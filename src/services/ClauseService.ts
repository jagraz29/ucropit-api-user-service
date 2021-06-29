import ServiceBase from './common/ServiceBase'
import { ms_license_url } from '../types'
import { IClauseProps } from '../interfaces'
const base_url = `${ms_license_url}/clauses`

export class ClauseService extends ServiceBase {
  /**
   *  create new clause.
   *
   * @param clause
   */
  public static async createClause(Clause: IClauseProps) {
    try {
      return this.makeRequestES6(
        'post',
        base_url,
        Clause)
    } catch (error) {
      throw new Error(error)
    }

  }
}
