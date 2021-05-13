import { v4 as uuidv4 } from 'uuid'
import pdf from 'handlebars-pdf'
import sha256 from 'sha256'
import { basePath, makeDirIfNotExists, removeFile, moveFile, readFile, readFileBuffer } from '../utils'
import { FileDocumentRepository } from '../repository'

export class PdfService {
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

    return this.findPdfExists(fullName,fileDocuments)
  }

  private static async findPdfExists (fullName: string,fileDocuments: Array<object>) {
    const filePdfTemp = `public/uploads/tmp/${fullName}`
    const pathCropHistory = `public/uploads/pdf-crop-history/`
    const pdfTmpBuffer = readFileBuffer(filePdfTemp)
    const fileDocument = fileDocuments.find(({ nameFile }) => {
      const pdfbuffer = readFileBuffer(`${pathCropHistory}${nameFile}`)
      return sha256(pdfTmpBuffer) === sha256(pdfbuffer)
    })
    if (fileDocument) {
      removeFile(filePdfTemp)
      return fileDocument.nameFile
    }
    moveFile(filePdfTemp,pathCropHistory)
    await FileDocumentRepository.createFile({ nameFile: fullName, path: fullPath, date: new Date(), cropId })
    return fullName
  }
}
