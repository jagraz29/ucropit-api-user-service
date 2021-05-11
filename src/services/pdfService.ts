
import { v4 as uuidv4 } from 'uuid'
import pdf from 'handlebars-pdf'
import { basePath, makeDirIfNotExists } from '../utils'
import fs from 'fs'
import { FileDocumentRepository } from '../repository'

export class PdfService {
  public static async generatePdf (nameTemplate, context, nameDirectory, nameFile): Promise<string | null> {

    const path = `${basePath()}public/uploads/${nameDirectory}`
    await makeDirIfNotExists(path)
    const fullName = `${nameFile}-${uuidv4()}.pdf`
    const fullPath = `${path}/${fullName}`

    const template = fs.readFileSync(`${basePath()}views/pdf/${nameTemplate}.hbs`, { encoding: 'utf-8' })

    await pdf.create({ template, context, path: fullPath })

    await FileDocumentRepository.createFile({ nameFile: fullName, path: fullPath, date: new Date() })

    return fullName
  }
}
