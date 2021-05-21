import { v4 as uuidv4 } from 'uuid'
import Handlebars from 'handlebars'
import pdf from 'html-pdf-node'
import sha256 from 'sha256'
import {
  makeDirIfNotExists,
  readFileBytes,
  saveFile,
  readFile
} from '../utils'
import { FileDocumentRepository } from '../repositories'
import { setScriptPdf } from '../helpers'
import { FileDocumentProps } from '../interfaces'

export class PDFService {
  public static async generatePdf (
    nameTemplate: string,
    context: object,
    directory: string,
    nameFile: string,
    { _id: cropId }
  ): Promise<string | null> {
    const fileDocuments: Array<FileDocumentProps> | null =
      await FileDocumentRepository.getFiles(cropId)

    const path: string = `public/uploads/${directory}/`
    await makeDirIfNotExists(path)
    const fullName: string = `${nameFile}-${uuidv4()}.pdf`
    const pathFile: string = `${path}${fullName}`

    const hbs: string = readFile(`views/pdf/${nameTemplate}.hbs`)
    const handlebarsWithScript = setScriptPdf(Handlebars)
    const template = handlebarsWithScript.compile(hbs)
    const content = template(context)
    // console.log(content)
    const pdfBytes = await pdf.generatePdf({ content }, { format: 'A4' })

    if (!fileDocuments) {
      saveFile(pathFile, pdfBytes)
      await FileDocumentRepository.createFile({
        nameFile: fullName,
        path: pathFile,
        date: new Date(),
        cropId
      })
      return fullName
    }

    return this.findAndSavePdfExists(directory, fullName, fileDocuments, cropId, pdfBytes)
  }

  private static async findAndSavePdfExists (
    directory: string,
    fullName: string,
    fileDocuments: Array<FileDocumentProps>,
    cropId,
    pdfBytes
  ) {
    const pathFile = `public/uploads/${directory}/`
    const fileDocument = fileDocuments.find(({ nameFile }) => {
      const oldPdfBytes = readFileBytes(`${pathFile}${nameFile}`)
      if (oldPdfBytes) {
        console.log(sha256(pdfBytes),sha256(oldPdfBytes))
        return sha256(pdfBytes) === sha256(oldPdfBytes)
      }
    })
    if (fileDocument) {
      return fileDocument.nameFile
    }
    saveFile(`${pathFile}${fullName}`, pdfBytes)
    await FileDocumentRepository.createFile({
      nameFile: fullName,
      path: `${pathFile}${fullName}`,
      date: new Date(),
      cropId
    })
    return fullName
  }
}
