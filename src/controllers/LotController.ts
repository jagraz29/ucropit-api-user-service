import { Request, Response } from 'express'
import {
  handleFileConvertJSON,
  mapArraySurfacesAndArea
} from '../services/ParseKmzFile'

class LotController {
  public async surfaces (req: Request, res: Response) {
    const result = await handleFileConvertJSON(req.files)

    const listNamesLots = mapArraySurfacesAndArea(result)

    res.status(200).json(listNamesLots)
  }
}

export default new LotController()
