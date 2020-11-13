import { Request, Response } from 'express'

import { getFullPath } from '../utils/Files'

import models from '../models'

const File = models.FileDocument

class FileController {
  /**
   * Download files.
   *
   * @param Request req
   * @param Response res
   *
   * @returns Response
   */
  public async download (req: Request, res: Response) {
    const { id } = req.params

    const file = await File.findById(id)

    res.download(getFullPath(file.path))
  }

  public async downloadSign (req: Request, res: Response) {
    const { id } = req.params

    const file = await File.findById(id)

    res.download(file.path)
  }
}

export default new FileController()
