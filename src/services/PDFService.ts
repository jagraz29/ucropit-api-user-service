import { v4 as uuidv4 } from 'uuid'
import Handlebars from 'handlebars'
import pdfParse from 'pdf-parse'
import Puppeteer from 'puppeteer'
import { makeDirIfNotExists, readFileBuffer, saveFile, readFile, basePath } from '../utils'
import { FileDocumentRepository } from '../repositories'
import { setScriptPdf } from '../helpers'
import { FileDocumentProps } from '../interfaces'

export class PDFService {
  public static async generatePdf (
    nameTemplate: string,
    context: object,
    nameDirectory: string,
    nameFile: string,
    { _id: cropId }
  ): Promise<string> {
    const fileDocuments: Array<FileDocumentProps> | null = await FileDocumentRepository.getFiles(cropId)
    const path: string = `public/uploads/${nameDirectory}/`
    await makeDirIfNotExists(path)
    const fullName: string = `${nameFile}-${uuidv4()}.pdf`
    const pathFile: string = `${path}${fullName}`

    const hbs: string = readFile(`views/pdf/html/${nameTemplate}.hbs`)
    const handlebarsWithScript = setScriptPdf(Handlebars)
    const template = handlebarsWithScript.compile(hbs)
    const html = template(context)
    // saveFile(`public/uploads/${directory}/content.html`, html);
    // console.log(html)

    const browser = await Puppeteer.launch()
    const page = await browser.newPage()
    await page.setContent(html)
    await page.addStyleTag({ path: `views/pdf/css/${nameTemplate}.css` })
    const pdfNewBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        // top: "70px",
        // bottom: "10%",
        left: '160px',
        right: '160px'
      }
    })

    if (!fileDocuments) {
      saveFile(pathFile, pdfNewBuffer)
      await FileDocumentRepository.createFile({
        nameFile: fullName,
        path: pathFile,
        date: new Date(),
        cropId
      })
      return fullName
    }

    return this.findAndSavePdfExists(
      nameDirectory,
      fullName,
      fileDocuments,
      cropId,
      pdfNewBuffer
    )
  }

  private static async findAndSavePdfExists (
    directory: string,
    fullName: string,
    fileDocuments: FileDocumentProps[],
    cropId,
    pdfNewBuffer
  ) {
    const { text: textNewPdf } = await pdfParse(pdfNewBuffer)
    const pathFile = `public/uploads/${directory}/${fullName}`

    const fileDocument = await Promise.all(fileDocuments.map(async (fileDocument) => {
      const oldPdfBuffer = readFileBuffer(fileDocument.path)
      if (oldPdfBuffer) {
        const { text: textOldPdf } = await pdfParse(oldPdfBuffer)
        if (textNewPdf === textOldPdf) return fileDocument
        return null
      }
    }))

    if (fileDocument[0]) {
      return fileDocument[0].nameFile
    }

    saveFile(pathFile, pdfNewBuffer)
    await FileDocumentRepository.createFile({
      nameFile: fullName,
      path: pathFile,
      date: new Date(),
      cropId
    })
    return fullName
  }
}
