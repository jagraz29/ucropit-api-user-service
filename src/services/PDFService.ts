import { v4 as uuidv4 } from 'uuid'
import pdf from 'handlebars-pdf'
import sha256File from 'sha256-file'
import { basePath, makeDirIfNotExists, removeFile, moveFile, readFile } from '../utils'
import { FileDocumentRepository } from '../repositories'

export class PDFService {
  public static async generatePdf (nameTemplate: string, context: object, nameDirectory: string, nameFile: string, { _id: cropId }): Promise<string | null> {

    const fileDocuments: Array<object> | null = await FileDocumentRepository.getFiles(cropId)
    const directory: string = fileDocuments ? 'tmp' : nameDirectory

    const path: string = `${basePath()}public/uploads/${directory}/`
    await makeDirIfNotExists(path)
    const fullName: string = `${nameFile}-${uuidv4()}.pdf`
    const fullPath: string = `${path}${fullName}`

    const template: string = readFile(`views/pdf/${nameTemplate}.hbs`)

    await pdf.create({ template, context, path: fullPath })

    if (!fileDocuments) {
      await FileDocumentRepository.createFile({ nameFile: fullName, path: fullPath, date: new Date(), cropId })
      return fullName
    }

    return this.findPdfExists(fullName,fileDocuments, cropId)
  }

  private static async findPdfExists (fullName: string,fileDocuments: Array<object>,cropId) {
    const filePdfTemp = `public/uploads/tmp/${fullName}`
    const pathCropHistory = `public/uploads/pdf-crop-history/`
    const fileDocument = fileDocuments.find(({ nameFile }) => {
      if (readFile(`${pathCropHistory}${nameFile}`)) {
        return sha256File(filePdfTemp) === sha256File(`${pathCropHistory}${nameFile}`)
      }
    })
    if (fileDocument) {
      removeFile(filePdfTemp)
      return fileDocument.nameFile
    }
    await moveFile(filePdfTemp,`${pathCropHistory}${fullName}`)
    await FileDocumentRepository.createFile({ nameFile: fullName, path: `${pathCropHistory}${fullName}`, date: new Date(), cropId })
    return fullName
  }
}
